<template>
    <div id="album-view">
    <div class="wrapper-header">
        <h1>ALBUMS</h1>
        <div class="settings">
            <button id="btn-grid" v-bind:class="[{ active : view == 1}]" v-on:click="setView(1)"><IconGrid /></button>
            <button id="btn-list" v-bind:class="[{ active : view == 2}]" v-on:click="setView(2)"><IconList /></button>
        </div>
    </div>
    <ul id="list-albums" v-bind:class="[{ grid : view == 1}]">
        <li v-for="album in albums" class="album">
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
import IconGrid from '../components/icons/IconGrid.vue'
import IconList from '../components/icons/IconList.vue'
import songData from '../data/songs.js'

export default {
    data() {        
        let songs = songData;
        let albumList = [];
        let albumNames = [];
        for (let i = 0; i<songs.length; i++) {
            if(albumNames.indexOf(songs[i].album.name) <0) {
                albumList.push(songs[i].album);
                albumNames.push(songs[i].album.name)
            }
        }
        console.log(albumNames)
        console.log(albumList)
        console.log(songData)
        return {
            view: 1,
            albums: albumList
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
        countTracks(name) {
            let count = 0;
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].album.name == name) {
                    count ++;
                }
            }
            if (count == 1) {
                return "1 song"
            } else {
                return count+" songs"
            }
        }
    },
}
</script>

<style>

</style>