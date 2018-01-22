import {tinyQuery as $} from './tinyQuery'
export default function (name) {
  var func = function () {
    $.getJSON('/asp/homepage/getStaffInfo.aspx?staffId=' + name, function (d) {
      $('.contact-info').prop('href', 'mailto:' + name + '@dvrpc.org').text([d[0], d[1], d[3]].join(' '))
    })
  }
  $(function () {
    $.PAGE_LOADED ? func() : $(document).on('load', func)
  })
}
