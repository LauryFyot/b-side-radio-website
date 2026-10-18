export function trackAdminClarityEvent(label) {
  window.dispatchEvent(new CustomEvent('bside-admin-clarity-event', { detail: label }));
}