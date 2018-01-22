class History {
  setItem(key, value) {
    var state = history.state || {}
    state[key] = value
    history.replaceState(state, null, location + '')
  }
  
  getItem(key) {
    return history.state !== null ? history.state[key] : null
  }
}

export default new History()
