import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/analytics.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

class Element {
  constructor(attributes = {}, ancestors = {}) {
    this.attributes = attributes;
    this.ancestors = ancestors;
    this.id = attributes.id || "";
  }

  closest(selector) {
    return this.ancestors[selector] || null;
  }

  matches(selector) {
    if (selector === "button:not(:disabled)") return this.attributes.tag === "button" && !this.attributes.disabled;
    return ["input", "textarea", "select"].includes(this.attributes.tag);
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }
}

class HTMLAnchorElement extends Element {
  get href() { return this.attributes.href; }
}

class HTMLFormElement extends Element {}

function setup({ href = "https://b-side-radio.com/", projectId } = {}) {
  const listeners = {};
  const scripts = [];
  const register = (type, handler, options) => {
    (listeners[type] ||= []).push({ handler, options });
  };
  const window = { location: new URL(href), addEventListener: register };
  const document = {
    createElement: () => ({}),
    head: { appendChild: (script) => scripts.push(script) },
    addEventListener: register,
  };
  const exports = {};
  vm.runInNewContext(compiled, { exports, window, document, Element, HTMLAnchorElement, HTMLFormElement, URL });
  exports.initAnalytics(projectId);
  const emit = (type, event) => listeners[type]?.forEach(({ handler }) => handler(event));
  const events = () => (window.dataLayer || []).filter((args) => args[0] === "event");
  return { window, scripts, listeners, emit, events, init: exports.initAnalytics };
}

test("audio and comment outcomes reach GA4 without Clarity", () => {
  const context = setup();
  for (const [label, name] of [
    ["radio-play-start", "radio_play"], ["radio-pause", "radio_pause"], ["radio-play-error", "radio_error"],
    ["mix-play-start", "mix_play"], ["mix-pause", "mix_pause"], ["mix-play-complete", "mix_complete"],
    ["mix-play-error", "mix_error"], ["comment-submit-success", "comment_submit_success"],
    ["comment-submit-error", "comment_submit_error"],
  ]) {
    context.emit("bside-clarity-event", { detail: label });
    assert.equal(context.events().at(-1)[1], name);
  }
  assert.equal(context.events()[0][2].station_name, "B Side Radio");
  const before = context.events().length;
  context.emit("bside-clarity-event", { detail: null });
  context.emit("bside-clarity-event", { detail: "unknown" });
  assert.equal(context.events().length, before);
});

test("player buttons distinguish play/pause at all three locations", () => {
  const context = setup({ projectId: "test-project" });
  assert.equal(context.listeners.click[0].options.capture, true);
  for (const [label, location] of Object.entries({
    "player-toggle-hero": "hero", "player-toggle-bar": "player_bar", "mix-play": "mix_sessions",
  })) {
    for (const pressed of ["false", "true"]) {
      const button = new Element({ tag: "button", "data-clarity-label": label, "aria-pressed": pressed, id: label });
      context.emit("click", { target: new Element({}, { "[data-clarity-label]": button }) });
      const event = context.events().at(-1);
      assert.equal(event[1], "player_click");
      assert.equal(event[2].button_location, location);
      assert.equal(event[2].player_action, pressed === "true" ? "pause" : "play");
      assert.equal(context.window.clarity.q.at(-1)[1], label);
    }
  }
});

test("Traxsource links distinguish hero, vinyls and player including nested clicks", () => {
  const context = setup();
  for (const [id, section, purchase] of [
    ["partner-traxsource-hero", "top", false], ["partner-traxsource-vinyls", "vinyls", false],
    ["", "vinyls", true], ["partner-traxsource-player", null, true],
  ]) {
    const link = new HTMLAnchorElement({ id, href: "https://www.traxsource.com/track/123" }, {
      "section[id]": section ? new Element({ id: section }) : null,
      li: !id ? new Element() : null,
    });
    context.emit("click", { target: new Element({}, { "a[href]": link }) });
    const event = context.events().at(-1);
    assert.equal(event[1], "traxsource_click");
    assert.equal(event[2].button_location, section === "top" ? "hero" : section || "player_bar");
    assert.equal(event[2].link_type, purchase ? "purchase" : "partnership");
  }
  const before = context.events().length;
  for (const href of ["https://fake-traxsource.com/", "https://traxsource.com.evil.test/", "https://example.com/traxsource.com"]) {
    const link = new HTMLAnchorElement({ href });
    context.emit("click", { target: new Element({}, { "a[href]": link }) });
  }
  assert.equal(context.events().length, before);
});

test("Clarity audio, focus and submit events are preserved", () => {
  const context = setup({ projectId: " test-project " });
  context.emit("bside-clarity-event", { detail: "radio-play-start" });
  context.emit("focusin", { target: new Element({ tag: "input", "data-clarity-label": "comment-email-focus" }) });
  context.emit("submit", { target: new HTMLFormElement({ "data-clarity-label": "comment-submit" }) });
  assert.deepEqual(Array.from(context.window.clarity.q, (args) => args[1]), ["radio-play-start", "comment-email-focus", "comment-submit"]);
  assert.equal(context.scripts[1].src, "https://www.clarity.ms/tag/test-project");
});

test("production restrictions and single initialization are preserved", () => {
  for (const href of ["http://localhost:5173/", "https://preview.vercel.app/", "https://b-side-radio.com/dev/", "https://b-side-radio.com/admin", "http://b-side-radio.com/"]) {
    const context = setup({ href, projectId: "test-project" });
    assert.equal(context.scripts.length, 0);
    assert.equal(Object.keys(context.listeners).length, 0);
  }
  const context = setup({ href: "https://www.b-side-radio.com/", projectId: "test-project" });
  context.init("test-project");
  assert.equal(context.scripts.length, 2);
  assert.equal(context.listeners.click.length, 1);
});