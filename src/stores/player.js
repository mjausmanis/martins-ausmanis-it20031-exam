import { reactive } from 'vue'

export const player = reactive({
    playlist   : [],
    now_playing: {}, // SONG OBJECT
    setPlaylist(songs) {
        this.playlist = songs;
    },
    setNowPlaying(song) {
        this.now_playing = song;
    },
    getNowPlayingSongId() {
        return this.now_playing?.id;
    },
    getNowPlaying() {
        return this.now_playing;
    },
    getNowPlayingAlbumID() {
        return this.now_playing?.album?.id ?? null;
    },
    getNowPlayingSongName() {
        return this.now_playing?.name ?? '';
    },
    getNowPlayingSongImage() {
        return this.now_playing?.album?.images[1].url ?? '';
    },
    getNowPlayingArtists() {
        return this.now_playing?.artists?.map(artist => artist.name).join(', ');
    },
    getNowPlayingSongPreview() {
        return this.now_playing?.preview_url;
    },
    getNextSong(){
        if (this.playlist.includes(this.now_playing)) {
            pos = this.songs.indexOf(this.now_playing);
            return this.playlist[pos+1];
        } else {
            return this.playlist[0];
        }
    },
    getPreviousSong() {
        if (this.playlist.includes(this.now_playing)) {
            if (this.songs.indexOf(this.now_playing) != 0){ 
                pos = this.songs.indexOf(this.now_playing);
                return this.playlist[pos-1];
            }
        } else {
            return this.playlist[0];
        }
    },
    resetNowPlaying() {
        this.now_playing = {};
    }
})