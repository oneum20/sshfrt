class EventManager {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    off(event, listenerToRemove) {
        if (!this.events[event]) return;

        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }

    emit(event, detail) {
        if (!this.events[event]) return;

        this.events[event].forEach(listener => listener(detail));
    }
}

export const eventManager = new EventManager();
  