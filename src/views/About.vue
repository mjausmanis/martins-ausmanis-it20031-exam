<template>
    <div id="about-view">
    <div class="wrapper-header">
        <h1>ABOUT ME</h1>
        <div class="settings">
            <button id="btn-edit" v-bind:class="{ active : editingForm }" v-on:click="toggleEdit()" v-text="btnText()"></button>
            <button id="btn-save" v-show="editingForm" v-on:click="toggleEdit(), saveInput()">Save Form</button>
        </div>
    </div>
    <form>
        <div class="wrapper-input">
            <label>NAME</label>
            <input v-show="editingForm" id="input-name" :placeholder="name" v-model="nameInput" :key="name" v-text="name"/>
            <p id="txt-name" v-show="!editingForm">{{name}}</p>
        </div>
        <div class="wrapper-input">
            <label>SURNAME</label>
            <input v-show="editingForm" id="input-surname" :placeholder="surname" v-model="surnameInput" v-text="surname"/>
            <p id="txt-surname" v-show="!editingForm">{{surname}}</p>
        </div>
        <div class="wrapper-input">
            <label>STUDENT CODE</label>
            <input v-show="editingForm" id="input-code" :placeholder="code" v-model="codeInput" v-text="code"/>
            <p id="txt-code" v-show="!editingForm">{{code}}</p>
        </div>
        <div class="wrapper-songs">
            <label>FAVORITE SONGS</label>
            <ul v-if="favoriteList.length > 0">
                <li v-for="song in favoriteList" :key="song">
                    <img id="img-album" :src="song.album.images[0].url" />
                    <div class="song-info">
                        <p id="txt-song" class="song-name">{{song.name}}</p>
                        <p id="txt-artist" class="song-artists">{{getArtists(song.artists)}}</p>
                    </div>
                </li>
            </ul>
            <div id="txt-empty" class="empty" v-if="favoriteList.length == 0">NO SONGS FOUND</div>
        </div>
    </form>
</div>
</template>

<script>
import {auth} from '../stores/auth.js'
export default {
    data() {
        return {
            editingForm: false,
            nameInput: '',
            surnameInput: '',
            codeInput: ''
        }
    },
    computed: {
        name: {
            get() {
                return auth.user.name;
            }
        },
        surname: {
            get() {
                return auth.user.surname;
            }
        },
        code: {
            get() {
                return auth.user.code;
            }
        },
        favoriteList: {
            get(){
                return auth.getFavoriteSongs()
            }
        }
    },
    methods:{
        toggleEdit() {
            if(this.editingForm) {
                //clear inputs
                this.editingForm = false;
            } else {
                this.editingForm = true;
            }
        },
        btnText(){
            if (this.editingForm) {
                return "Cancel"
            } else return "Edit form"
        },
        saveInput() {
            let finName = this.nameInput, finSur = this.surnameInput, finCode = this.codeInput;
            if(this.nameInput == '') {
                finName = auth.user.name;
            }
            if(this.surnameInput == '') {
                finSur = auth.user.surname;
            }
            if(this.codeInput == '') {
                finCode = auth.user.code;
            }
            auth.setUserData(finName, finSur, finCode);
        },
        getArtists(artists) {
            var list = '';
            artists.forEach(element => {
                list = list.concat(element.name).concat(", ")
            })
            list = list.slice(0, -2)
            return list;
        },
    }
}
</script>

<style>

</style>