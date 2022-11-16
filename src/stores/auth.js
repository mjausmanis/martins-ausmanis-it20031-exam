import {reactive} from 'vue'
import router from '../router';
import songs from '../data/songs.js'

export const auth = reactive ({
    user : {
        name : 'Mārtiņš',
        surname : 'Ausmanis',
        code : 'IT20031',
        favorite_songs: localStorage.favorite_songs ?? '',
    },

is_authenticated: localStorage.is_authenticated ?? false,

setUserData(name, surname, code) {
    this.user.name = name;
    this.user.surname = surname;
    this.user.code = code;
},

authenticate(email, password) {
    if (email == "martinsjekabs.ausmanis@va.lv" && password == 'password'){
        this.is_authenticated = true;
        localStorage.is_authenticated = true;
        router.go('/')
    }
},

logout() {
    localStorage.clear();
    this.is_authenticated = false;
    localStorage.is_authenticated = false;  
    router.go('/login')
},

toggleFavorite(songID) {
    if (this.user.favorite_songs.includes(songID)) {
        let splitList = this.user.favorite_songs.split("; ");
        let pos = splitList.indexOf(songID);
        splitList.splice(pos, 1);
        this.user.favorite_songs = splitList.join("; ")
    } else {
        if (this.user.favorite_songs == undefined) {
            this.user.favorite_songs = songID;
        }
        this.user.favorite_songs += songID;
        this.user.favorite_songs += "; "
    }
    
    localStorage.favorite_songs = this.user.favorite_songs;
},

getFavoriteSongs() {
    let list = [];
    for (let i = 0; i < songs.length; i++) {
        if(localStorage.favorite_songs != undefined && localStorage.favorite_songs.includes(songs[i].id)) {
            list.push(songs[i]);
        }
    }
    return list;
}
})