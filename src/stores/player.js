import { reactive } from 'vue'

export const player = reactive({
    playlist   : [],
    now_playing: {}, // SONG OBJECT
    setPlaylist(songs) {
        this.playlist = songs;
        this.now_playing = songs[0]
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
        let pos = this.playlist.indexOf(this.now_playing);
        return this.playlist[pos+1]
    },
    getPreviousSong() {
        if (this.playlist.indexOf(this.now_playing) >= 0) {
            if (this.playlist.indexOf(this.now_playing) != 0){ 
                let pos = this.playlist.indexOf(this.now_playing);
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