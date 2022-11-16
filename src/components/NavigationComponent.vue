<template>
    <nav id="nav-main" class="wrapper-navigation">
            <ol>
                <li v-for="link in this.navArray" :key="link" >
                    <router-link :to=link.path>{{link.name}}</router-link>
                </li>
            </ol>
        </nav>
</template>

<script>
export default {
    data() {
        return {
            navArray: [
                {path: "/", name: "SONGS"},
                {path: "/albums", name: "ALBUMS"},
                {path: "/about", name: "ABOUT"},
            ]
        }
    }
}
</script>

<style>

</style>