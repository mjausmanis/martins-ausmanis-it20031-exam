import {reactive} from 'vue'
import router from '../router';

export const auth = reactive ({
name : 'Mārtiņš',
surname : 'Ausmanis',
code : 'IT20031',
favorite_songs: localStorage.favorite_songs ?? '',

is_authenticated: localStorage.is_authenticated ?? false,

setUserData(name, surname, code) {
    this.name = name;
    this.surname = surname;
    this.code = code;
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
    if (this.favorite_songs.includes(songID)) {
        let splitList = this.favorite_songs.split("; ");
        let pos = splitList.indexOf(songID);
        splitList.splice(pos, 1);
        this.favorite_songs = splitList.join("; ")
    } else {
        this.favorite_songs += songID;
        this.favorite_songs += "; "
    }

    console.log(this.favorite_songs)
    localStorage.favorite_songs = this.favorite_songs;
},

getFavoriteSongs() {
    return this.favorite_songs;
}

})