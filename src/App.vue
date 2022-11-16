<template>
    <Header v-if="authCheck"></Header>
    <div id="section-body">
        <Navigation v-if="authCheck"></Navigation>
        <router-view class="section-router"></router-view>
    </div>
    <div v-if="authCheck" id="section-player">
        <AudioPlayer />
    </div>
</template>

<script>
export default {
    data() {
        let conversion = false;
        if(localStorage.is_authenticated == 'true') {
            conversion = true;
        }
        return {
            authCheck : conversion
        }
    }
}
</script>
