class EventEmitter {
  constructor() {
    this.events = [];
  }
  on(name, handler) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(handler);
  }

  emit(name, ...args) {
    this.events[name] && this.events[name].forEach((event) => event(...args));
  }

  off(name, handler) {
    if (handler) {
      const index = this.events[name].indexOf(handler);
      this.events[name].splice(index, 1);
    } else {
      this.events[name] = [];
    }
  }
}
