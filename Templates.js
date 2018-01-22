class Templates {
  nav (b) {
    var a
    return (b = '' + ('<li class="sublist" data-img="' + ((a = b.img) == null ? '' : a) + '"><a href="' + ((a = b.href) == null ? '' : a) + '">' + ((a = b.link) == null ? '' : a) + '</a><ul>'))
  }
  navItem (b) {
    var a
    return (b = '' + ('<li><a style="' + ((a = b.style) == null ? '' : a) + '" data-img="' + ((a = b.img) == null ? '' : a) + '" class="' + ((a = b.class) == null ? '' : a) + '" href="' + ((a = b.href) == null ? '' : a) + '">' + ((a = b.link) == null ? '' : a) + '</a></li>'))
  }
  events (b) {
    var a
    return (b = '' + ('<div class="col-sm-4"><div class="card"><div class="media"><div class="media-left media-middle">' + ((a = b.date) == null ? '' : a) + '' + ((a = b.time) == null ? '' : a) + '</div><div class="media-body media-middle"><h4><a href="' + ((a = b.abs) ==
      null ? '' : a) + '">' + ((a = b.title) == null ? '' : a) + '</a></h4></div></div>'))
  }
  pubs (b) {
    var a
    return (b = '' + ('<div class="col-sm-4"><div class="card"><h4><a href="/Products/' + ((a = b.id) == null ? '' : a) + '">' + ((a = b.title) == null ? '' : a) + '</a></h4><img data-src="/asp/pubs/100px/' + ((a = b.id) == null ? '' : a) + '.png" alt="pub cover" class="pubCover" style="float:left" /><p>' + ((a = b.abs) == null ? '' : a) + '</p></div></div>'))
  }
  anns (b) {
    var a
    return (b = '' + ('<div class="col-sm-4"><div class="card"><h4><a href="' + ((a = b.link) == null ? '' : a) +
      '">' + ((a = b.title) == null ? '' : a) + '</a></h4><p>' + ((a = b.abs) == null ? '' : a) + '</p></div></div>'))
  }
  ads (b) {
    var a
    return (b = '' + ('<div class="col-sm-4"><div><p><a href="' + ((a = b.link) == null ? '' : a) + '"><img src="' + ((a = b.img) == null ? '' : a) + '" alt="' + ((a = b.title) == null ? '' : a) + '" style="' + ((a = b.style) == null ? '' : a) + '"/></a></p></div></div>'))
  }
}

export default new Templates()

/* out of date below
var template = [
  {name: 'nav', template: _.template('<li class="sublist"><a href="{{data.href}}">{{data.link}}</a><ul>', {variable: 'data'})},
  {name: 'navItem', template: _.template('<li><a href="{{data.href}}">{{data.link}}</a></li>', {variable: 'data'})},
  {name: 'events', template: _.template('<div class="col-sm-4"><div class="media"><div class="media-left media-middle">{{data.date}}{{data.time}}</div><div class="media-body media-middle"><a href="{{data.abs}}">{{data.title}}</a></div></div>', {variable: 'data'})},
  {name: 'pubs', template: _.template('<div class="col-sm-4"><img src="/asp/pubs/100px/{{data.id}}.gif" alt="pub cover" class="pubCover" style="float:left" /><h4><a href="/Products/{{data.id}}">{{data.title}}</a></h4><p><i>{{data.abs}}</i></p></div>', {variable: 'data'})},
  {name: 'anns', template: _.template('<div class="col-sm-4"><h4><a href="{{data.link}}">{{data.title}}</a></h4><p><i>{{data.abs}}</i></p></div>', {variable: 'data'})},
  {name: 'ads', template: _.template('<div class="col-sm-4"><p><a href="{{data.link}}"><img src="{{data.img}}" alt="{{data.title}}"/></a></p></div>', {variable: 'data'})}
]
*/
