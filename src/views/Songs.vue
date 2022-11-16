<template>
    <div id="songs-view" @scroll="handleScroll">
    <div class="wrapper-header">
        <h1>SONGS</h1>
        <div class="wrapper-search">
            <input v-model="keyword" id="input-search" placeholder="Search by title..." />
        </div>
        <div class="wrapper-settings">
            <button v-bind:class="[{ active: show_favorites }]" id="btn-show-favorites" v-on:click="showFavorites()">Show Favorites</button>
        </div>
    </div>
    <div class="wrapper-songs">
        <table cellspacing="0" cellpadding="0">
            <tr ref="header">
                <th id="th-id" >#</th>
                <th v-bind:class="[{ active: sort_by_title }]" id="th-title" v-on:click="sortBy(1)">
                    Title
                    <IconCaretUp v-if="sort_by_title == true" v-bind:class="{ 'flip-vertical': sortState === 2 }" />
                </th>
                <th id="th-artist">Artist</th>
                <th id="th-album">Album</th>
                <th v-bind:class="[{ active: sort_by_duration}]" id="th-duration" v-on:click="sortBy(2)">
                    Duration
                    <IconCaretUp v-if="sort_by_duration == true" v-bind:class="{ 'flip-vertical': sortState === 2 }"/>
                </th>
            </tr>
            <!-- Loop goes on this <tr> element -->
            <tr class="song" v-for="(song, index) in songs" :key="index" v-on:dblclick="selectSong(song)">
                <td id="td-index">
                    <IconPlay />
                    <span id="txt-index" v-text="index+1"></span>
                </td>
                <td id="td-title">
                    <img :src="song.album.images[0].url" />
                    {{song.name}}
                </td>
                <td id="td-artist" v-text="getArtists(song.artists)"></td>
                <td id="td-album">{{song.album.name}}</td>
                <td id="td-duration">
                    {{getTime(song.duration_ms)}}
                    <IconHeart v-on:click="toggleFavorite(song.id), $forceUpdate()" v-bind:class="[{ active : isFavorite(song.id)}]" :key="index"/>
                </td>
            </tr>
        </table>
    </div>
</div>
</template>

<script>
import { auth } from '../stores/auth.js'
import songData from '../data/songs.js'
import { player } from '../stores/player.js'
import IconCaretUp from '../components/icons/IconCaretUp.vue'
import IconHeart from '../components/icons/IconHeart.vue'
import IconPlay from '../components/icons/IconPlay.vue'

export default {
    data() {
        return {
            keyword : '',
            show_favorites: false,
            sort_by_title: false,
            sort_by_duration: false,
            sortState: 0,
            songs: songData
        }
    },
    components: {
        IconCaretUp, 
        IconHeart,
        IconPlay
    },
    methods: {
        handleScroll(event) {
            this.$refs.header.classList.value = event.target.scrollTop > 100 ? 'scrolled' : '';
        },
        toggleFavorite(songID) {
            auth.toggleFavorite(songID)
        },
        showFavorites() {
            this.show_favorites = !this.show_favorites
            let favorites = [];
            if (this.show_favorites && localStorage.favorite_songs != undefined) {
                for (let i = 0; i < this.songs.length; i++) {
                    if (localStorage.favorite_songs.includes(this.songs[i].id)) {
                        favorites.push(this.songs[i]);
                    }
                }
                this.songs = favorites;
            } else {
                this.songs = songData
            }
        },
        sortBy(value){
            if ( value == 1) {
                this.sort_by_duration = false;
                this.sort_by_title = true;
            } else if ( value == 2) {
                this.sort_by_title = false;
                this.sort_by_duration = true;
            }

            if (this.sortState == 0) {
                this.songs.sort((a, b) => {
                    let fa = a.name.toLowerCase(), fb = b.name.toLowerCase(); 
                    if (value == 2) {
                        fa = a.duration_ms, fb = b.duration_ms; 
                    }
                    if (fa < fb) {
                        return -1
                    }
                    if (fa > fb) {
                        return 1
                    }
                    return 0
                })
                this.sortState = 1;
            } else if (this.sortState == 1) {
                this.songs.sort((b, a) => {
                    let fa = a.name.toLowerCase(), fb = b.name.toLowerCase(); 
                    if (value == 2) {
                        fa = a.duration_ms, fb = b.duration_ms; 
                    }
                    if (fa < fb) {
                        return -1
                    }
                    if (fa > fb) {
                        return 1
                    }
                    return 0
                })
                this.sortState = 2;
            } else if (this.sortState == 2) {
                this.songs = songData;
                this.sort_by_duration = false;
                this.sort_by_title = false;
                this.sortState = 0;
            }
            
        },
        getArtists(artists) {
            var list = '';
            artists.forEach(element => {
                list = list.concat(element.name).concat(", ")
            })
            list = list.slice(0, -2)
            return list;
        },
        selectSong(song) {  
            player.setNowPlaying(song);
        },
        isFavorite(songID){
            if (localStorage.favorite_songs != undefined && localStorage.favorite_songs.includes(songID)) {
                return true;
            } else {
                return false;
            }
        },  
        getTime(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        }
    }
}
</script>

<style>

</style>