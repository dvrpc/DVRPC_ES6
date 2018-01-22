/*!
 * Custom Event polyfill for IE
 * see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
export default function () {
  return (function () { function b (b, a) { a = a || {bubbles: !1, cancelable: !1, detail: void 0}; var c = document.createEvent('CustomEvent'); c.initCustomEvent(b, a.bubbles, a.cancelable, a.detail); return c } if (typeof window.CustomEvent === 'function') return !1; b.prototype = window.Event.prototype; window.CustomEvent = b })()
}
