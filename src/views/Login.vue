<template>
    <div id="login-view">
        <form class="login-form">
            <div class="wrapper-logo">
                <img src="@/assets/logo.svg" />
                <div>KRAKEN.FM</div>
            </div>
            <input id="input-email" placeholder="E-mail" v-model="email" />
            <input id="input-password" placeholder="Password" v-model="password" />
            <button :disabled="isDisabled" id="btn-submit" v-on:click="logIn()">LOGIN</button>
        </form>
    </div>
</template>

<script>
import { auth } from '../stores/auth.js'
export default {
    data() {
        return {
            email : '',
            password : ''
        }
    },
    computed: {
        isDisabled: function() {
            if (this.email.length > 0 && this.password.length >= 6) {
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        logIn() {
            console.log('attempt login')
            auth.authenticate(this.email, this.password);
        }
    }
}

</script>
