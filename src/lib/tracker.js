const MAX_PAGE_TITLE_CATEGORY_LENGTH = 30;

export class Tracker {
    constructor({
        category = false,
        log = false,
        prefix = 'uxtest',
        trackerName = null
    }) {
        if (!category) {
            category = this.getCategoryFromTitle();
            category = category.slice(0, MAX_PAGE_TITLE_CATEGORY_LENGTH);
        }

        this.id = `${prefix}-${category}`;
        this.log = log;
        this.trackerName = trackerName;
        this._log(`Tracker initialized with ${this.id}`);
        this.track('trackinit', this.getIsoDate());
    }

    _log() {
        if (this.log) {
            console.log.apply(this, arguments);
        }
    }

    _trackEvent(action, label) {
        // If we have a trackerName, the send command needs this prefixed
        // See https://groups.google.com/forum/#!topic/google-analytics-analyticsjs/mayu2cf1d0k
        const sendCommand = this.trackerName ? `${this.trackerName}.send` : 'send';

        this._log(`Trackevent: ${sendCommand} ${action} - ${label}`);

        // Always check if the 'ga' object is in the global window,
        // otherwise just ignore
        if (!('ga' in window)) {
            this._log(`WARN: 'ga' object not available, not sending command!`);
            return;
        }

        ga(sendCommand, 'event', this.id, action, label);
    }

    getCategoryFromTitle() {
        let title = document.title.split('').map((char) => {
            char = char.toLowerCase();

            if (/[a-z0-9]/.test(char)) {
                // a-z character or digit
                return char;
            } else if (char === " ") {
                return '_';
            } else {
                return '';
            }
        });

        return title.join('');
    }

    getIsoDate() {
        const now = new Date();
        return now.toISOString();
    }

    track(action, label = '') {
        this._trackEvent(action, label);
    }
}