import $ from './TinyQuery'
import Templates from './Templates'
import History from './History'

export function buildNav (n) {
  if (n.hasOwnProperty('links')) {
    var str = Templates.nav(n)
    n.links.forEach(function (l) {
      str += buildNav(l)
    })
    return str + '</ul></li>'
  } else {
    return Templates.navItem(n)
  }
}

export function filterByHref (el) {
  return el.getAttribute('href').toLowerCase() === '/about/'//location.pathname.toLowerCase()
}

export function filterBySection (el) {
  return this.toString() === $(el).children().first().innerText
}

export function getCurrentPage () {
  var parent = $('.nav-menu')
  var ss = History.getItem('parents') || sessionStorage.getItem('parents')

  if (ss !== null && ss.length !== 0) {
    ss.split(',').forEach(function (txt) {
      parent = parent.find('.sublist').filter(filterBySection.bind(txt))
    })
    var result = parent.find('a').filter(filterByHref)
    if (result.length > 0) {
      return $(result[0])
    }
  }
  return $($('.nav-menu a').filter(filterByHref)[0])
}
