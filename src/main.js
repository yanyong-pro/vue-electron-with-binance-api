import App from './App.vue'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueMask from 'v-mask'
import axios from 'axios'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueMask)

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
