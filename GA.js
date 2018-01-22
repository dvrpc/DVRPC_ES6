export default function (trackers) {
  var j = document.createElement('script')
  j.src = '//www.google-analytics.com/analytics.js'
  j.async = true
  document.getElementsByTagName('head')[0].appendChild(j)

  window.ga = window.ga || function () {
    (ga.q = ga.q || []).push(arguments)
  }
  ga.l = +new Date()

  trackers.forEach(function (tracker) {
    ga('create', tracker, 'auto', tracker)
  })

  function ga_send () {
    trackers.forEach(function (tracker) {
      ga.apply(null, [tracker + '.send'].concat(arguments))
    })
  }

  ga(function () {
    // Track pageview
    ga_send('pageview', location.pathname)

    // Track file downloads
    ;['doc', 'docx', 'xls', 'xlsx', 'pdf', 'zip', 'ppt', 'pptx', 'jpg', 'png', 'gif', 'jpeg'].forEach(function (fileType) {
      $('a[href$=\\.' + fileType + ']').on('click', function () {
        ga_send('event', 'Static File', 'Download', this.href)
      })
    })

    // Track javascript errors
    window.onerror = function (msg, url, line) {
      ga_send('event', 'Javascript Error', 'Log', 'Line ' + line + ':' + msg, { nonInteraction: true })
    }

    // Track search terms
    $('#subMenuItem form').on('submit', function () {
      ga_send('event', 'Search', 'Submit', $(this).find('input')[0].value)
    })
  })
}
