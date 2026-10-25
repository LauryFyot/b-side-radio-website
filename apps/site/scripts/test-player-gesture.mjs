import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/player/player-context.tsx", import.meta.url), "utf8");
const withAutoplay = ts.transpileModule(source.replace("const ENABLE_AUTOPLAY = false;", "const ENABLE_AUTOPLAY = true;"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const withoutAutoplay = ts.transpileModule(source.replace("const ENABLE_AUTOPLAY = true;", "const ENABLE_AUTOPLAY = false;"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

class Element {
  constructor(selector, parent = null) { this.selector = selector; this.parent = parent; }
  closest(selectors) {
    return selectors.split(",").some((selector) => selector.trim() === this.selector)
      ? this : this.parent?.closest(selectors) || null;
  }
}

function mountPlayer({ autoplay = false, fail = false, deferred = false } = {}) {
  const slots = [];
  const effects = [];
  const cleanups = [];
  const listeners = new Map();
  let cursor = 0;
  const audio = {
    src: "", loads: 0, plays: 0, pauses: 0, fail, pending: [],
    getAttribute(name) { return name === "src" && this.src ? this.src : null; },
    load() { this.loads += 1; },
    play() {
      this.plays += 1;
      if (deferred) return new Promise((resolve, reject) => this.pending.push({ resolve, reject }));
      return this.fail ? Promise.reject(new Error("Blocked")) : Promise.resolve();
    },
    pause() { this.pauses += 1; },
  };
  function useState(initial) {
    const index = cursor++;
    if (!(index in slots)) slots[index] = typeof initial === "function" ? initial() : initial;
    return [slots[index], (value) => { slots[index] = typeof value === "function" ? value(slots[index]) : value; }];
  }
  function useMemo(factory, dependencies) {
    const index = cursor++;
    const cached = slots[index];
    if (!cached || dependencies.some((value, position) => !Object.is(value, cached.dependencies[position]))) {
      slots[index] = { dependencies, value: factory() };
    }
    return slots[index].value;
  }
  const react = {
    createContext: () => ({ Provider: "Provider" }),
    useState, useMemo,
    useCallback: (callback, dependencies) => useMemo(() => callback, dependencies),
    useRef: (initial) => useMemo(() => ({ current: initial }), []),
    useEffect: (effect, dependencies) => useMemo(() => { effects.push(effect); }, dependencies),
  };
  const window = {
    addEventListener: (name, handler, options) => listeners.set(name, { handler, options }),
    removeEventListener: (name) => listeners.delete(name),
  };
  const exports = {};
  vm.runInNewContext(autoplay ? withAutoplay : withoutAutoplay, {
    exports, window, Element,
    require: (name) => {
      if (name === "react") return react;
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }) };
      if (name === "@/lib/radio") return { getRadioStreamUrl: () => "https://example.com/stream" };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  function render() {
    cursor = 0;
    return exports.PlayerProvider({ children: null }).props.value;
  }
  render().audioRef.current = audio;
  const mountedEffects = effects.splice(0);
  mountedEffects.forEach((effect) => cleanups.push(effect()));
  function emit(name, target) {
    const listener = listeners.get(name);
    if (!listener) return;
    if (listener.options?.once) listeners.delete(name);
    listener.handler({ target });
  }
  async function click(target, explicitPlayer = false) {
    if (explicitPlayer) render().toggleLive();
    emit("click", target);
    await new Promise((resolve) => setImmediate(resolve));
  }
  const unmount = () => cleanups.splice(0).forEach((cleanup) => cleanup?.());
  return {
    audio, render, emit, click, unmount,
    replayEffects: () => { unmount(); mountedEffects.forEach((effect) => cleanups.push(effect())); },
  };
}

test("disabling ENABLE_AUTOPLAY keeps first-click behavior without native autoplay", () => {
  const player = mountPlayer();
  assert.equal(player.audio.plays, 0);
  assert.equal(player.audio.loads, 0);
  const bar = readFileSync(new URL("../src/components/player/player-bar.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(bar, /\bautoPlay\b/);
});

for (const selector of ["#player-toggle-hero", "#player-toggle-bar"]) {
  test(`first click on ${selector}, including its icon, plays once without pausing`, async () => {
    const player = mountPlayer();
    const icon = new Element("svg", new Element(selector));
    player.emit("pointerdown", icon);
    player.emit("touchstart", icon);
    await player.click(icon, true);
    assert.equal(player.audio.plays, 1);
    assert.equal(player.audio.loads, 1);
    assert.equal(player.audio.pauses, 0);
    assert.equal(player.render().playing, true);
    await player.click(icon, true);
    assert.equal(player.audio.pauses, 1);
    assert.equal(player.render().playing, false);
    await player.click(new Element("main"));
    assert.equal(player.audio.plays, 1);
    await player.click(icon, true);
    assert.equal(player.audio.plays, 2);
    assert.equal(player.audio.loads, 1);
    assert.equal(player.render().playing, true);
  });
}

test("a first click elsewhere starts once, not once per pointer/touch/key event", async () => {
  const player = mountPlayer();
  const target = new Element("main");
  player.emit("pointerdown", target);
  player.emit("touchstart", target);
  player.emit("keydown", target);
  assert.equal(player.audio.plays, 0);
  await player.click(target);
  await player.click(target);
  assert.equal(player.audio.plays, 1);
  assert.equal(player.audio.loads, 1);
});

for (const selector of ['[data-clarity-label="mix-play"]', "audio"]) {
  test(`first click on ${selector} does not start live radio`, async () => {
    const player = mountPlayer();
    await player.click(new Element(selector));
    await player.click(new Element("main"));
    assert.equal(player.audio.plays, 0);
  });
}

test("a rejected first play remains stopped and can be retried explicitly", async () => {
  const player = mountPlayer();
  player.audio.fail = true;
  await player.click(new Element("main"));
  assert.equal(player.render().playing, false);
  player.audio.fail = false;
  await player.click(new Element("#player-toggle-bar"), true);
  assert.equal(player.render().playing, true);
});

test("unmount removes the first-gesture handler", async () => {
  const player = mountPlayer();
  player.unmount();
  await player.click(new Element("main"));
  assert.equal(player.audio.plays, 0);
});

test("allowed autoplay runs once, including an effect replay, without restarting on the first click", async () => {
  const player = mountPlayer({ autoplay: true });
  player.replayEffects();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(player.audio.plays, 1);
  assert.equal(player.audio.loads, 1);
  assert.equal(player.render().playing, true);
  await player.click(new Element("main"));
  assert.equal(player.audio.plays, 1);
  await player.click(new Element("#player-toggle-bar"), true);
  assert.equal(player.audio.pauses, 1);
  assert.equal(player.render().playing, false);
  await player.click(new Element("main"));
  assert.equal(player.audio.plays, 1);
});

for (const explicitPlayer of [false, true]) {
  test(`blocked autoplay falls back to a ${explicitPlayer ? "player" : "general"} click without immediate pause`, async () => {
    const player = mountPlayer({ autoplay: true, fail: true });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(player.render().playing, false);
    player.audio.fail = false;
    await player.click(new Element(explicitPlayer ? "#player-toggle-hero" : "main"), explicitPlayer);
    assert.equal(player.audio.plays, 2);
    assert.equal(player.audio.loads, 1);
    assert.equal(player.audio.pauses, 0);
    assert.equal(player.render().playing, true);
  });
}

test("a late autoplay rejection cannot undo a successful manual play", async () => {
  const player = mountPlayer({ autoplay: true, deferred: true });
  await player.click(new Element("#player-toggle-bar"), true);
  assert.equal(player.audio.pending.length, 2);
  player.audio.pending[1].resolve();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(player.render().playing, true);
  player.audio.pending[0].reject(new Error("Autoplay blocked"));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(player.render().playing, true);
});