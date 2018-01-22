/*!
 * JQuery replacement for IE9+
 * @author jstrangfeld
 * Credits: youmightnotneedjquery.com, Zepto.js
 */

// import CustomEvent from './CustomEvent'

class NodeCollection {
  constructor (selector, context) {
    if (!selector) return Object.assign(this, [], {length: 0})
    if (typeof selector === 'string') {
      if (selector.indexOf('<') === 0) {
        let els = $.parseHTML(selector)
        this._assign(els, {selector: selector, length: els.length})
      } else {
        let parent = (typeof context === 'string')
          ? document.querySelectorAll(context)
          : (context === undefined)
            ? document
            : context
        if (parent.length > 1) {
          let results = []
          Array.from(parent).forEach(function (p) {
            results = results.concat(Array.from(p.querySelectorAll(selector)))
          })
          this._assign(results, {selector: selector, length: results.length})
        } else {
          let result = (typeof parent.length === 'undefined' ? parent : parent[0]).querySelectorAll(selector)
          this._assign(result, {selector: selector, length: result.length})
        }
      }
    } else if (typeof selector.nodeType !== 'undefined') {
      this._assign([selector], {selector: selector, length: 1})
    } else if (typeof selector === 'function') {
      this._assign([document], {selector: 'document', length: 1})
      this.ready(selector)
    }
  }

  _assign () {
    Object.getOwnPropertyNames(this).filter(method => /\d+/.test(method)).forEach(method => delete this[method])
    Object.assign(this, ...arguments)
    return this
  }

  addClass (classNames) {
    this.each(function () {
      classNames.split(' ').forEach(token => this.classList.add(token))
    })
    return this
  }

  after (html) {
    if (typeof html === 'string') {
      this.each(function () {
        this.insertAdjacentHTML('afterend', html)
      })
    } else {
      this.each(function () {
        html.forEach(newEl => this.parentNode.insertAfter(newEl, this))
      })
    }
    return this
  }

  append (el) {
    if (typeof el === 'string') {
      el = new NodeCollection(el)
    }
    if (el.length > 1) {
      let fragment = document.createDocumentFragment()
      el.each(function () {
        fragment.appendChild(this)
      })
      this.each(function () {
        this.appendChild(fragment)
      })
    } else {
      this.each(function () {
        this.appendChild(el.first())
      })
    }
    return this
  }

  attr (attribute, value) {
    if (typeof attribute === 'object') {
      this.each(function () {
        Object.keys(attribute).forEach(key => this.setAttribute(key, attribute[key]))
      })
      return this
    } else {
      if (typeof value !== 'undefined') {
        this.each(function () {
          this.setAttribute(attribute, value)
        })
        return this
      } else {
        return this.length ? this.first().getAttribute(attribute) : ''
      }
    }
  }

  before (html) {
    if (typeof html === 'string') {
      this.each(function () {
        this.insertAdjacentHTML('beforebegin', html)
      })
    } else {
      this.each(function () {
        html.forEach(newEl => this.parentNode.insertBefore(newEl, this))
      })
    }
    return this
  }

  children () {
    return new NodeCollection(Array.prototype.concat(...this.map(el => el.children)))
  }

  closest (selector) {
    if (!this.length) return new NodeCollection([])
    let ancestors = []
    this.each(function () {
      let parent = $(this.parentNode)
      while (!parent.matches(selector)) {
        parent = parent.parent()
      }
      ancestors.push(parent.first())
    })
    let result = ancestors.filter(el => el !== undefined)
    return new NodeCollection(result)
  }

  css (obj, strValue) {
    if (strValue !== undefined) {
      let key = obj
      obj = {}
      obj[key] = strValue
    } else if (typeof obj === 'string') {
      return getComputedStyle(this.first())[obj]
    }
    this.each(function () {
      Object.keys(obj).forEach(key => {
        this.style[key] = obj[key]
      })
    })
    return this
  }

  data (prop, value) {
    if (arguments.length === 0) {
      return this.length ? this.first().data || {} : ''
    }
    if (arguments.length === 2) {
      this.each(function () {
        if (!this.hasOwnProperty('data')) {
          this.data = {}
        }
        this.data[prop] = value
      })
      return this
    } else {
      return this.length ? this.first().data[prop] : ''
    }
  }

  forEach (func) {
    return Object.getOwnPropertyNames(this).filter(method => /\d+/.test(method)).forEach(func)
  }

  each (callback) {
    ;[].every.call(this, (el, idx) => {
      return callback.call(el, idx, el) !== false
    })
    return this
  }

  empty () {
    this.each(function () {
      this.innerHTML = ''
    })
    return this
  }

  every (testFunc) {
    return Object.getOwnPropertyNames(this).filter(method => /\d+/.test(method)).map(obj => this[obj]).every(testFunc)
  }

  filter (filterFunc) {
    let result = Object.getOwnPropertyNames(this).filter(method => /\d+/.test(method)).map(obj => this[obj]).filter(filterFunc)
    return this._assign(result, {selector: this.selector, length: result.length})
  }

  find (selector) {
    return this.length ? new NodeCollection(selector, this) : new NodeCollection([])
  }

  first () {
    return this[0] || document.createElement('_')
  }

  hasClass (className) {
    return this.some(el => el.classList.contains(className))
  }

  hide () {
    this.each(function () {
      this.style.display = 'none'
    })
    return this
  }

  html (string) {
    if (string !== undefined) {
      this.each(function () {
        this.innerHTML = string
      })
      return this
    } else {
      return this.length ? this.first().innerHTML : ''
    }
  }

  map (mapFunc) {
    return Object.getOwnPropertyNames(this).filter(method => /\d+/.test(method)).map(obj => this[obj]).map(mapFunc)
  }

  matches (selector) {
    let el = this.first()
    if (el === undefined) {
      return false
    }
    let _matches = (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector)
    return _matches
      ? _matches.call(el, selector)
      : [].some.call(this.parent().find(selector), n => n === el)
  }

  next () {
    let result = this.map(el => el.nextElementSibling).filter(el => el !== null)
    return this._assign(result, {selector: this.selector, length: result.length})
  }

  off (eventName, eventHandler) {
    this.each(function () {
      this.removeEventListener(eventName, eventHandler)
    })
    return this
  }

  on (eventName, eventHandler) {
    this.each(function () {
      this.addEventListener(eventName, eventHandler)
    })
    return this
  }

  parent () {
    return new NodeCollection(this.length ? this.first().parentNode : [])
  }

  parents (filter) {
    return this.parentsUntil('html', filter)
  }

  parentsUntil (selector, filter = '*') {
    if (!this.length) return new NodeCollection([])
    let results = []
    this.forEach(el => {
      while ((el = el.parentNode) && el.nodeType !== 9) {
        if (el.nodeType === 1) {
          results.push(el)
        }
      }
    })
    return new NodeCollection(results).filter(el => el.matches(filter))
  }

  prepend (el) {
    if (typeof el === 'string') {
      el = $(el)
    }
    this.each(function () {
      this.insertBefore(el.first(), this.firstChild)
    })
    return this
  }

  prev () {
    let result = this.map(el => el.previousElementSibling).filter(el => el !== null)
    return this._assign(result, {selector: this.selector, length: result.length})
  }

  prop (attribute, value) {
    return this.attr(attribute, value)
  }

  ready (fn) {
    if (document.readyState !== 'loading') {
      fn()
    } else {
      document.addEventListener('DOMContentLoaded', fn)
    }
  }

  remove () {
    this.each(function () {
      this.parentNode.removeChild(this)
    })
    return this
  }

  removeClass (classNames) {
    this.each(function () {
      classNames.split(' ').forEach(token => this.classList.remove(token))
    })
    return this
  }

  serialize () {
    return this.find('input[name], textarea[name], button[name], select[name]').map(function (el) {
      if (el.type === 'checkbox' || el.type === 'radio') {
        return el.checked ? el.name + '=' + encodeURIComponent(el.value) : undefined
      } else {
        return el.name + '=' + encodeURIComponent(el.value)
      }
    }).filter(n => n !== undefined).join('&')
  }

  siblings () {
    let el = this.first()
    let siblings = Array.prototype.filter.call(el.parentNode.children, node => node !== el)
    return this._assign(siblings, {selector: this.selector, length: siblings.length})
  }

  show () {
    this.each(function () {
      this.style.display = ''
    })
    return this
  }

  some (testFunc) {
    return Object.getOwnPropertyNames(this).filter(method => /\d+/.test(method)).map(obj => this[obj]).some(testFunc)
  }

  text (string) {
    if (string !== undefined) {
      this.each(function () {
        this.textContent = string
      })
      return this
    } else {
      return this.length ? this.first().textContent : ''
    }
  }

  toggleClass (classNames) {
    this.each(function () {
      classNames.split(' ').forEach(token => this.classList.toggle(token))
    })
    return this
  }

  trigger (eventName) {
    let event = document.createEvent('Event')
    event.initEvent(eventName, true, true)
    this.each(function () {
      this.dispatchEvent(event)
    })
  }

  static ajax (opts) {
    let request = new XMLHttpRequest()
    request.open(opts.type || 'GET', opts.url, true)
    request.setRequestHeader('Content-Type', opts.contentType || 'application/x-www-form-urlencoded; charset=UTF-8')

    opts.headers && Object.keys(opts.headers).forEach(function (el) {
      request.setRequestHeader(el, opts.headers[el])
    })

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) {
          opts.success && opts.success.call(this, this.responseText, this.status, this)
        } else {
          opts.error && opts.error.call(this)
        }
      }
    }

    request.send(opts.data || null)
    request = null
  }

  static getJSON (url, success, error) {
    return NodeCollection.ajax({
      type: 'GET',
      url: url,
      success: function (d, s, x) {
        success.call(this, JSON.parse(d), s, x)
      },
      error: error
    })
  }

  static get (url, success, error) {
    return $.ajax({
      type: 'GET',
      url: url,
      success: success,
      error: error
    })
  }

  static parseHTML (str) {
    let node = document.createElement('div')
    node.innerHTML = str
    return Array.from(node.children)
  }

  static post (url, success, error) {
    return $.ajax({
      type: 'POST',
      url: url,
      success: success,
      error: error
    })
  }

  static trim (string) {
    return string.replace(/^\s+|\s+$/g, '')
  }
}

function $ (selector, context) {
  return new NodeCollection(selector, context)
}

for (let method of Object.getOwnPropertyNames(NodeCollection)) {
  if (!/length|name|prototype/.test(method)) {
    $[method] = NodeCollection[method]
  }
}

export default $
