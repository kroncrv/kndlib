import { AudioPlayer } from './audio-player.js';

export class SoundManager {
    constructor({
        muted = false,
        loop = false,
        single = false,
        players = false,
        playFromStart = false,
        volume = 1
    }) {
        if (!players) {
            throw new Error('Players can not be empty or false');
        }

        this.muted = muted;
        this.volume = volume;
        this.loop = loop;
        this.single = single;
        this.playFromStart = playFromStart;
        this.players = this.getPlayers(players);
    }

    each(fn) {
        for (let id in this.players) {
            fn(this.players[id], id);
        }
    }

    getPlayers(players) {
        const p = {};

        for (let id in players) {
            p[id] = new AudioPlayer(players[id], {
                loop : this.loop,
                muted : this.muted
            });
        }

        return p;
    }

    pause() {
        this.each(p => p.pause());
    }

    play(id, seek = false) {
        if (this.single) {
            this.pause();
        }

        if (seek) {
            this.players[id].seek(seek);
        }

        if (this.playFromStart) {
            this.players[id].seek(0);
        }

        this.players[id].play();
    }

    set(name, val) {
        if (this[name]) {
            this[name] = val;
        }
    }

    get muted() {
        return this._muted;
    }

    get volume() {
        return this._volume;
    }

    set muted(muted) {
        this._muted = muted;
        this.each(p => p.setMuted(muted));
    }

    set volume(volume) {
        this._volume = volume;
        this.each(p => p.setVolume(volume));
    }
}