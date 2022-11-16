<template>
    <div id="songs-view" @scroll="handleScroll">
    <div class="wrapper-header">
        <h1>SONGS</h1>
        <div class="wrapper-search">
            <input v-model="keyword" id="input-search" placeholder="Search by title..."/>
        </div>
        <div class="wrapper-settings">
            <button v-bind:class="{ active: show_favorites }" id="btn-show-favorites" v-on:click="showFavorites()">Show Favorites</button>
        </div>
    </div>
    <div class="wrapper-songs">
        <table cellspacing="0" cellpadding="0">
            <tr ref="header">
                <th id="th-id" >#</th>
                <th v-bind:class="{ active: sort_by_title }" id="th-title" v-on:click="sortBy(1)">
                    Title
                    <IconCaretUp v-if="sort_by_title == true" v-bind:class="{ 'flip-vertical': sortState === 2 }" />
                </th>
                <th id="th-artist">Artist</th>
                <th id="th-album">Album</th>
                <th v-bind:class="{ active: sort_by_duration}" id="th-duration" v-on:click="sortBy(2)">
                    Duration
                    <IconCaretUp v-if="sort_by_duration == true" v-bind:class="{ 'flip-vertical': sortState === 2 }"/>
                </th>
            </tr>
            <!-- Loop goes on this <tr> element -->
            <tr class="song" v-for="(song, index) in songs" :key="index" v-on:dblclick="selectSong(song)" :class="{active : isPlaying(song)}">
                <td id="td-index">
                    <IconPlay v-show="isPlaying(song)"/>
                    <span id="txt-index" v-text="index+1" v-if="isPlaying(song) == false"></span>
                </td>
                <td id="td-title">
                    <img :src="song.album.images[0].url" />
                    {{song.name}}
                </td>
                <td id="td-artist" v-text="getArtists(song.artists)"></td>
                <td id="td-album">{{song.album.name}}</td>
                <td id="td-duration">
                    {{getTime(song.duration_ms)}}
                    <IconHeart v-on:click="toggleFavorite(song.id), $forceUpdate()" v-bind:class="{ active : isFavorite(song.id)}" :key="index"/>
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
            changedSongs: []
        }
    },
    computed: {
        songs: {
            get(){
                if (this.changedSongs.length > 0) {
                    return this.findFromKeyword(this.changedSongs);
                } else {
                    return this.findFromKeyword(songData)
                }
            }
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
            if (this.show_favorites ) {
                this.changedSongs = auth.getFavoriteSongs();
            } else {
                this.changedSongs = songData;
            }
        },

        //weird sorts
        sortBy(value){
            //jauns masīvs priekš kopijas, lai oriģinālo nesortotu
            let sorted;
            //Ja ir tikai favorites, sorto tikai tos.
            if (this.show_favorites) {
                //Piešķir sorted favorites kopiju
                sorted = auth.getFavoriteSongs().concat();
            } else {
                sorted = songData.concat();
            }
            //Izfiltrē sorted, lai tur būtu tikai tās dziesmas, kas sakrīt ar search
            sorted = this.findFromKeyword(sorted);
            //value - 1: sorto title, value - 2 : sorto duration;
            if ( value == 1) {
                this.sort_by_duration = false;
                this.sort_by_title = true;
            } else if ( value == 2) {
                this.sort_by_title = false;
                this.sort_by_duration = true;
            }

            //sortState-0: unsorted; sortState-1:a-z/ascending; sortState-2:z-a/descending
            //bet ja ir ticis nospiests, tad pārveido uz nākamo, so jāčeko priekš iepriekšējā
            if (this.sortState == 0) {
                sorted.sort((a, b) => {
                    let fa = a.name.toLowerCase(), fb = b.name.toLowerCase(); 
                    // ja sorting duration, tad nomaina fa, fb vērtības;
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
                //piešķir mainīgajam
                this.changedSongs = sorted;
                //nomaina state uz to kāds ir
                this.sortState = 1;
            } else if (this.sortState == 1) {
                sorted.sort((b, a) => {
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
                this.changedSongs = sorted;
                this.sortState = 2;
            } else if (this.sortState == 2) {
                //unsorted
                //attiestata changedSongs
                if (this.show_favorites) {
                    this.changedSongs = auth.getFavoriteSongs();
                } else {
                    this.changedSongs = songData;
                }
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
            player.setPlaylist(this.songs)
            player.setNowPlaying(song);
        },
        isFavorite(songID){
            if (localStorage.favorite_songs != undefined && localStorage.favorite_songs.includes(songID)) {
                return true;
            } else {
                return false;
            }
        },  
        isPlaying(song) {
            return player.getNowPlaying().id == song.id;
        },
        getTime(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        },
        findFromKeyword(songs) {
            if (this.keyword != '') {
                let result = [];
                    for ( let i = 0; i < songs.length; i++) {
                        if (songs[i].name.toLowerCase().includes(this.keyword.toLowerCase())) {
                            result.push(songs[i])
                        }
                    }
                return result;
            } else {
                return songs
            }
            
        }
    }
}
</script>

<style>

</style>