export class AudioPlayer {
    constructor(src, opts = {}) {
        this.src = src;
        this.opts = opts;
        this.playing = false;
        this.duration = 0;
        this.time = 0;
        this.loaded = false;
        this.loop = this.opts.loop || false;

        this.player = document.createElement('audio');

        this.player.addEventListener('playing', this.updatePlaystate.bind(this));
        this.player.addEventListener('pause', this.updatePlaystate.bind(this));
        this.player.addEventListener('timeupdate', this.updatePlaystate.bind(this));

        this.player.preload = 'none';
        this.player.volume = this.opts.volume || 0.5;
        this.player.muted = this.opts.muted || false;
        this.player.src = src;

        this.player.addEventListener('ended', (e) => {
            if (this.loop) {
                this.play(0);
            }
        });
    }

    formatTime(secs) {
        const minutes = Math.floor(secs / 60) || 0;
        const seconds = (secs - minutes * 60) || 0;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    pause() {
        this.player.pause();
    }

    play(seek = false) {
        if (seek) {
            this.seek(seek);
        }

        this.player.play();
    }

    seek(time) {
        this.player.currentTime = time;
    }

    setMuted(muted) {
        this.player.muted = muted;
    }

    setVolume(volume) {
        this.player.volume = volume;
    }

    updatePlaystate() {
        const duration = Math.round(this.player.duration || 0);
        const time = Math.round(this.player.currentTime || 0);
        this.duration = this.formatTime(duration);
        this.time = this.formatTime(time);
        this.playing = !this.player.paused;

        if (this.opts.onchange) {
            this.opts.onchange.call(this);
        }
    }

    toggle() {
        if (this.playing) {
            this.player.pause();
        } else {
            this.player.play();
        }
    }
};