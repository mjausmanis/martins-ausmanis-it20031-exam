<template>
    <div id="album-view">
    <div class="wrapper-header">
        <h1>ALBUMS</h1>
        <div class="settings">
            <button id="btn-grid" v-bind:class="{ active : view == 1}" v-on:click="setView(1)"><IconGrid /></button>
            <button id="btn-list" v-bind:class="{ active : view == 2}" v-on:click="setView(2)"><IconList /></button>
        </div>
    </div>
    <ul id="list-albums" v-bind:class="{ grid : view == 1}">
        <li v-for="album in albums" class="album" :key="album" v-on:dblclick="selectAlbum(album)" v-bind:class="{ active : checkIfPlaying(album.id) }">
            <img id="img-album" :src="album.images[1].url"/>
            <div class="album-info">
                <h4 id="txt-album-name">{{album.name}}</h4>
                <p id="txt-album-artists">{{album.artists[0].name}}</p>
                <div class="album-year">
                    <p id="txt-album-year">{{getYear(album.release_date)}}</p>
                    <p id="txt-album-tracks">{{countTracks(album.name)}}</p>
                </div>
            </div>
        </li>
    </ul>
</div>
</template>

<script>
import { player } from '../stores/player.js'
import IconGrid from '../components/icons/IconGrid.vue'
import IconList from '../components/icons/IconList.vue'
import songData from '../data/songs.js'

export default {
    data() {        
        return {
            nowPlayingAlbum: player.getNowPlayingAlbumID(),
            view: 1
        }
    },
    computed: {
        albums: {
                get() {
                    let songs = songData;
                    let albumList = [];
                    let albumNames = [];
                    for (let i = 0; i<songs.length; i++) {
                        if(albumNames.indexOf(songs[i].album.name) <0) {
                            albumList.push(songs[i].album);
                            albumNames.push(songs[i].album.name)
                        }
                    }
                    return albumList
                }
            }
    },
    components: {
        IconGrid,
        IconList
    },
    methods:{
        setView(value) {
            this.view = value;
        },
        getYear(date) {
            let year = date.slice(0, 4);
            return year
        },
        getTracks(name) {
            let trackList = [];
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].album.name == name) {
                    trackList.push(songData[i]);
                }
            }
            return trackList;
        },
        countTracks(name) {
            let count = this.getTracks(name).length;
            return count;
        },
        selectAlbum(album) {
            for ( let i = 0; i < songData.length; i++) {
                if (songData[i].album.name == album.name) {
                    player.setPlaylist(this.getTracks(album.name))
                }
            }
        },
        checkIfPlaying(albumID) {
            return albumID == player.getNowPlayingAlbumID();
        }
    },
}
</script>

<style>

</style>