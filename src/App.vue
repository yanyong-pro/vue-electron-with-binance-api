<template>
  <v-app class="v-app">
    <v-main>
        <component
            @go-to-home="activeComponent = 'home'"
            @go-to-setting="activeComponent = 'setting'"
            :is="activeComponent">
        </component>
    </v-main>
  </v-app>
</template>

<script>
import home from '@/components/home'
import setting from '@/components/setting'
export default {
    name: 'App',

    components: {
        home,
        setting
    },

    data () {
        return {
            activeComponent: 'home'
        }
    }
}
</script>
<style lang="scss" scoped>
.v-app {
    background-color: #171b26 !important;
    color: white !important;
    font-size: 18px;
}
</style>
