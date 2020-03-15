import Vue from 'vue'
import Vuex from 'vuex'
import directory from './modules/directory'
import ui from './modules/ui'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    directory: directory,
    ui: ui
  }
})
