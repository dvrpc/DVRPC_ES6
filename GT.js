export default function () {
  var j = document.createElement('script')
  j.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  j.async = true
  document.getElementsByTagName('head')[0].appendChild(j)
}

export function googleTranslateElementInit () {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    autoDisplay: true,
    gaTrack: true,
    layout: google.translate.TranslateElement.FloatPosition.TOP_RIGHT,
    gaId: 'UA-9825778-4'
  }, 'google_translate_element')
}
