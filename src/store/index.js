import Vue from 'vue'
import Vuex from 'vuex'
const Store = require('electron-store')
const store = new Store()

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        lineApiToken: store.get('lineApiToken'),
        symbols: store.get('symbols')
    },
    mutations: {
        updateSetting: (state, payload) => {
            state.lineApiToken = payload.lineApiToken
            store.set('lineApiToken', payload.lineApiToken)
        },

        updateSymbols: (state, payload) => {
            state.symbols = payload
            store.set('symbols', payload)
        }
    },
    actions: {
        updateSetting: ({ commit }, payload) => {
            commit('updateSetting', payload)
        },

        updateSymbols: ({ commit }, payload) => {
            commit('updateSymbols', payload)
        }
    },
    modules: {
    }
})
