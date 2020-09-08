import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    openId:'', //用户的openId
    unionid:'', //用户的unionid
    user: {},
    clientHeight:'',
    studentlists:[]
  },
  getters: {
    openId: state => state.openId,
    user: state => state.user
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_OPENID: (state, openId) => {
      state.openId = openId
    },
    SET_UNIONID: (state, unionid) => {
      state.unionid = unionid
    },
    SET_CLIENTHEIGHT: (state, clientHeight) => {
      state.clientHeight = clientHeight
    },
    SET_STUDENT: (state, studentlists) => {
      state.studentlists = studentlists
    },
  }
})
