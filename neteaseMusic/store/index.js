import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    topListIds: [],
    nextId: ''
  },
  mutations: {
    initTopListIds(state, paylod) {
      state.topListIds = paylod
    },
    nextId(state, paylod) {
      for (const i in state.topListIds) {
        let index = Number(i)
        if (state.topListIds[i].id == paylod) {
          if (state.topListIds[index + 1]) {

            state.nextId = state.topListIds[index + 1].id
          }


        }
      }
    }
  },
  actions: {

  }
})
