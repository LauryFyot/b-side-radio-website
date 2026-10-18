export function trackClarityEvent(label: string) {
  window.dispatchEvent(new CustomEvent("bside-clarity-event", { detail: label }));
}