import '@babel/polyfill'
import $ from './TinyQuery'
import {buildNav, getCurrentPage} from './Nav'
import History from './History'
import Templates from './Templates'
import GT from './GT'
import GA from './GA'
import Navigation from './Navigation'

window.$ = window.$ || $
$(function () {
  navigator.userAgent.indexOf('MSIE 7.0') > -1 && alert('Internet Explorer is configured incorrectly to view this page.  Please follow the steps below.\n\n1. Open Tools > Compatibility View settings\n2. Remove dvrpc.org entry from list\n3. Uncheck Display intranet sites in compatibility view')
  parseFloat(navigator.appVersion.split(' ')[0]) < 5 && $('body').append('<div style="z-index:2000;font-weight:bold;padding-top:1em;text-align:center;position:fixed;bottom:0;height:50px;left:0;right:0;background:#ae3600;color: #ddd;border-bottom: 5px solid #ddd;"><a href="http://whatbrowser.org/">Please update your browser for your security</a></div>')

  $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="theme-color" content="#0078ae"/><link rel="icon" type="image/png" href="/img/banner/new/bug-favicon.png" sizes="32x32"/><link rel="icon" type="image/png" sizes="192x192" href="/img/banner/new/bug-highres.png"/><link rel="apple-touch-icon" sizes="152x152" href="/img/banner/new/bug-apple-touch.png"/>')

  var navstr = $('<ul class="nav-menu"></ul>')
  var str = []
  Navigation.forEach(function (n) {
    str.push(buildNav(n))
  })
  navstr.append(str.join('\n'))
  $('#navColumn>div').append('<h2 class="visible-xs">Explore DVRPC</h2><div></div>')
  $('#navColumn>div>div').append(navstr)

  if (location.pathname.length > 1) {
    console.log(getCurrentPage())
    var current = getCurrentPage().addClass('current')
    var parents = current.parentsUntil('.nav-menu', 'li.sublist')
    if (parents.length > 1) {
      parents.addClass('opened')
    }

    parents.some(function (el) {
      var url = $(el).attr('data-img')
      return url.length && $('#header').css('background-image', 'url(' + url + ')')
    })
    current.attr('data-img') && $('#header').css('background-image', 'url(' + current.attr('data-img') + ')')

    parents.forEach(function (el) {
      $('html').addClass($(el).find('a').text().replace(/\W/g, '_'))
    })
    $('html').addClass(current.text().replace(/\W/g, '_') || '_')
    if (current.next().find('li').length) {
      //current.parent().addClass('visible')
    } else {
      current.closest('ul').closest('li').addClass('visible')
    }
    // $('.nav-menu').addClass(current.length ? 'opened' : 'active')

    var pstr = parents.map(function (el) { return $(el).children().first().innerText }).reverse()

    History.setItem('parents', pstr.join(','))
    sessionStorage.setItem('parents', parents.map(function (el) { return $(el).children().first().innerText }).reverse())
  }

  $.getJSON('/asp/homepage/default.aspx', function (d, s, x) {
    if (!!x.getResponseHeader('Accept-Language') && x.getResponseHeader('Accept-Language').split('-')[0] !== 'en') {
      location = (location.pathname + '#googtrans/en/' + x.getResponseHeader('Accept-Language').split('-')[0] + '')
    }
    var months = [null, 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    var events = d.events.map(function (e) {
      var month = months[parseInt(e.StartDate.substr(5, 2))]
      var day = e.StartDate.substr(8, 2)
      var datestr = month + '<b>' + day + '</b>'
      var hour = e.StartTime !== null ? parseInt(e.StartTime.substr(0, 2)) : ''
      var time = e.StartTime !== null ? hour > 12 ? (hour - 12) + e.StartTime.substr(2) : hour + e.StartTime.substr(2) : ''
      return {
        id: e.id,
        title: e.Title,
        date: datestr,
        time: time,
        abs: e.Info || '/Calendar/' + e.StartDate.substr(0, 4) + '/' + e.StartDate.substr(5, 2),
        contact: e.StaffEmail
      }
    })
    var pubs = d.pubs.map(function (p) {
      return {
        abs: p.Abstract.slice(0, 250) + '&hellip;',
        id: p.PubId,
        title: p.Title,
        img: p.PubId
      }
    })
    var anns = d.anns.map(function (a) {
      return {
        link: a.link,
        title: a.title,
        abs: a.description
      }
    })
    var alerts = d.alert.Text
    var ads = [{
      title: 'Breaking Ground',
      link: '/BreakingGround/',
      img: '/img/2017Placards-01.png',
      style: 'max-width: 175px;'
    },
    {
      title: 'Connections 2045',
      link: '/Connections2045/',
      img: '/img/2017Placards-02.png'
    },
    {
      title: 'DVRPC News',
      link: '/Newsletters/DVRPCNews/',
      img: '/img/dvrpcnews.png',
      style: 'max-width:200px;margin-top:10px;margin-bottom:10px;'
    }]

    createAnnsWidget(anns)
    createEventsWidget(events)
    createPubsWidget(pubs)
    createAdWidgets(ads)
    createTwitterWidget()
    createAlertWidget(alerts)

    $('#homepage h2[data-target="#anns-widget"]').parent().addClass('active')
    $('#homepage #anns-widget').addClass('active')
  })

  $('#bodyWrap').after('<div id="contactWrap"><div id="contact"><div class="row"><div>Contact: <a class="contact-info"></a></div></div></div></div><div id="footerWrap"><div id="footer"><h2 class="visible-xs">Useful Information</h2><div class="row"></div></div></div><div id="footer2Wrap"><div id="footer2"><div class="row"></div></div></div>')
  createFooter()
  createPubsList()

  $('#topCurves').append('<a href="/"><img src="/img/homepage/dvrpclogo70px.png" alt="DVRPC"/></a>')

  $('#subMenuItem').append('<div class="row"><div class="col-sm-12"><a href="/"><img src="/img/homepage/dvrpclogo70px.png" alt="DVRPC"/></a><ul class="list-inline"><li class="visible-xs"><a href="/" title="Home"><span class="icon icon-home"></span><span class="sr-only">Home</span></a></li><li><form action="/search/" class="input-group-animated"><label for="q" class="sr-only">Search</label><input placeholder="Search" type="text" name="q" id="q" /><button type="submit" class="btn-link" title="Search"><span class="icon icon-search"></span><span class="sr-only">Search</span></button></form></li><li><a href="/sitemap/" title="Sitemap"><span class="icon icon-index"></span><span class="sr-only">Sitemap</span></a></li><li><a href="http://feeds.feedburner.com/DVRPCAnnouncements" title="RSS Newsfeed" rel="noopener"><span class="icon icon-rss"></span><span class="sr-only">RSS News</span></a></li><li><a href="http://www.facebook.com/DVRPC" title="Facebook" rel="noopener"><span class="icon icon-fb"></span><span class="sr-only">Facebook</span></a></li><li><a href="http://www.twitter.com/DVRPC" title="Twitter" rel="noopener"><span class="icon icon-twitter"></span><span class="sr-only">Twitter</span></a></li><li><a href="http://www.instagram.com/DVRPC" title="Instagram" rel="noopener"><span class="icon icon-instagram"></span><span class="sr-only">Instagram</span></a></li><li><a href="http://www.linkedin.com/company/delaware-valley-regional-planning-commission" title="LinkedIn" rel="noopener"><span class="icon icon-linkedin"></span><span class="sr-only">LinkedIn</span></a></li><li><a href="https://www.flickr.com/photos/111232174@N05/sets/" title="Flickr" rel="noopener"><span class="icon icon-flickr"></span><span class="sr-only">Flickr</span></a></li></ul></div></div>')

  $('.topBodyB').append('<div class="row"><div class="col-xs-3"><h2 data-target="#anns-widget">Announcements <small><a href="http://feeds.feedburner.com/DVRPCAnnouncements" rel="noopener">View More</a></small></h2></div><div class="col-xs-3"><h2 data-target="#pubs-widget">Products <small><a href="/Products/Search/">View More</a></small></h2></div><div class="col-xs-3"><h2 data-target="#events-widget">Events <small><a href="/Calendar/">View More</a></small></h2></div><div class="col-xs-3"><h2 data-target="#twitter-widget">Twitter <small><a rel="noopener" href="https://www.twitter.com/dvrpc">View More</a></small></h2></div></div>')

  $('.topBodyB .row>div').on('click', function () {
    var removeonly = $(this).hasClass('active')
    $('#topBodyCurves .active').removeClass('active')
    if (!removeonly) {
      $(this).addClass('active')
      var target = $($(this).find('h2').prop('data-target'))
      target.addClass('active')
      target.find('img[data-src]').forEach(function (img) { $(img).prop('src', $(img).prop('data-src')) })
    }
  })

  $('#rightHandWrap')[0].scrollTop = History.getItem(location.href)

  $('#rightHandWrap').on('scroll', function (e) {
    $('#subMenuItem>.row>.col-sm-12>a>img').prop('src', (this.scrollTop > 20) ? '/img/homepage/logo_small30px.png' : '/img/homepage/dvrpclogo70px.png')
    History.setItem(location.href, this.scrollTop)
  })

  $('#subMenuItem form').on('mouseover', function () {
    $(this).parent().find('input[name=q]').first().focus()
  })

  $('.dropdown-toggle').on('click', function (e) {
    $(this).parent().toggleClass('open')
    e.preventDefault()
  })

  $('[data-toggle=collapse]').on('click', function (e) {
    $($(this).attr('href')).toggleClass('in')
    e.preventDefault()
  })

  $('a[rel=external], a.gitem').prop('target', '_blank').prop('rel', 'noopener')

  GA(['UA-9825778-1', 'UA-9825778-4', 'UA-9825778-5'])
  GT()

  'serviceWorker' in navigator && navigator.serviceWorker.register('/service-worker.js', {scope: '/'})

  // $('#header').append('<a id="message" href="mailto:public_affairs@dvrpc.org" class="card">We\'d love to hear what you think about our new website!</a>')

  $.PAGE_LOADED = true
  $('body').trigger('load')
})

function createEventsWidget (events) {
  var tmpl = $('<div id="events-widget"><h2 class="visible-xs"><a href="/Calendar/">Events</a></h2></div>')
  var t1 = $('<div class="row gallery"></div>')
  var t2 = $('<div class="row gallery"></div>')

  events.slice(0, 3).forEach(function (d) {
    t1.append(Templates.events(d))
  })

  events.slice(3).forEach(function (d) {
    t2.append(Templates.events(d))
  })
  $('.topBodyTR').append(tmpl.append(t1).append(t2))
}

function createPubsWidget (pubs) {
  var tmpl = $('<div class="row gallery" id="pubs-widget"></div>')
  pubs.forEach(function (d) {
    tmpl.append(Templates.pubs(d))
  })
  $('.topBodyTR').append('<h2 class="visible-xs"><a href="/Products/Search/">Products</a></h2>').append(tmpl)
}

function createAnnsWidget (anns) {
  var tmpl = $('<div class="row gallery" id="anns-widget"></div>')
  anns.forEach(function (d) {
    tmpl.append(Templates.anns(d))
  })
  $('.topBodyTR').append('<h2 class="visible-xs"><a href="http://feeds.feedburner.com/DVRPCAnnouncements">Announcements</a></h2>').append(tmpl)
}

function createAdWidgets (ads) {
  ads.forEach(function (d) {
    $('#footer .row').append(Templates.ads(d))
  })
}

function createTwitterWidget (pubs) {
  var tmpl = $('<div class="row gallery" id="twitter-widget"></div>')
  $.getJSON('/asp/homepage/twitter.aspx', function (data) {
    data.forEach(function (d) {
      tmpl.append('<div class="col-sm-4"><div class="card"><h4 style="text-transform: none;font-style: normal;padding: 0 0 5px 0;margin: 0;"><a href="https://www.twitter.com/' + d.screen_name + '">' + d.name + '</a> <small style="color: rgba(0,0,0,.87);font-weight:400">@' + d.screen_name + ' &middot; ' + d.date + '</small></h4><div style="position: relative;border-radius:3px;overflow:hidden;"><p style="z-index:1;position: ' + (d.img.length ? 'absolute;background-color: rgba(255,255,255,.8);padding: 5px' : 'relative') + ';margin: 0 0 9px;"' + (d.img.length ? '' : ' class="lead"') + '>' + d.text + '</p>' + (d.img && d.img.length ? '<div style="margin: 0 -18px -18px"><a href="https://www.twitter.com/' + d.screen_name + '/status/' + d.id + '" rel="noopener" style="display:block"><img alt="twitter image" style="float:none;" data-src="' + d.img + '" /></a></div>' : '') + '</div></div>')
    })
  })
  $('.topBodyTR').append('<h2 class="visible-xs"><a href="https://twitter.com/DVRPC">Twitter</a></h2>').append(tmpl)
}

function createAlertWidget (alerts) {
  alerts !== null && alerts.length && $('#header').append('<div style="background:#ae0000;color:#fff" id="message">' + alerts + '</div>')
}

function createFooter () {
  $('#footer2 .row').append('<div class="col-sm-8"><a href="/" class="no-underline"><img src="/img/banner/new/dvrpclogotinywhite.png" alt="DVRPC"/></a><p>190 N. Independence Mall West, 8th Floor,<br/>Philadelphia, PA 19106-1520<br/>215.592.1800<br/>&copy; Delaware Valley Regional Planning Commission</p></div><div class="col-sm-4"><form method="POST" action="https://app.e2ma.net/app2/audience/signup/1808352/1403728/" class="input-group-animated"><a href="https://app.e2ma.net/app2/audience/signup/1808352/1403728/" rel="noopener">Sign up for our email lists</a><br/><br/></form><p><a href="/policies/">Policies</a> | <a href="/Links/">Other Links</a><div id="google_translate_element"></div></p></div>')
}

function pubsTemplate (attr, uri) {
  var els = $('#mainContent *[' + attr + ']')
  var urlstr

  if (!els.length) return

  urlstr = els.map(function (el) {
    return el.getAttribute(attr)
  }).join(',').split(',').map($.trim).join(',')

  $.ajax({
    type: 'POST',
    url: uri,
    contentType: 'application/json',
    data: JSON.stringify(urlstr),
    success: function (d) {
      els.addClass('list-group').each(function () {
        var el = this
        var data = JSON.parse(d)

        el.getAttribute(attr).split(',').map($.trim).forEach(function (id) {
          data.hasOwnProperty(id) && data[id].Title !== undefined && $(el).append('<li class="list-group-item media"><a class="media-left" href="/Products/' + id + '/"><img src="/asp/pubs/30px/' + id + '.png" alt="Publication Cover" width="30" class="pubCover"></a><div class="media-body"><a href="/Products/' + id + '/">' + data[id].Title + (data[id].Subtitle ? ' - ' + data[id].Subtitle : '') + '</a></div></li>')
        })
      })
    }
  })
}

function createPubsList () {
  pubsTemplate('data-pubs', '/api/pubs/')

  $('#mainContent *[data-pubs-type]').addClass('list-group').forEach(function (el) {
    $.getJSON('/api/pubs/type/' + $(el).attr('data-pubs-type'), function (data) {
      data.forEach(function (d) {
        $(el).append('<li class="list-group-item media"><a class="media-left" href="/Products/' + d.PubId + '"><img src="/asp/pubs/30px/' + d.PubId + '.png" alt="Publication Cover" width="30" class="pubCover"></a><div class="media-body"><a href="/Products/' + d.PubId + '">' + d.Title + (d.Subtitle ? ' - ' + d.Subtitle : '') + '</a></div></li>')
      })
    })
  })
}

window.getStaffInfo = () => null
