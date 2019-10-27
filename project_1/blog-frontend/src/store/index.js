import Vue from "vue"
import Vuex from "vuex"
import getters from "./getters.js"
import mutations from "./mutations.js"
import actions from "./actions.js"

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isLogin: false, // 登录状态
        isShowLoginDialog: false, // 登录弹出框
        userInfo: {
            type: "", // 暂时规定 0为买家 1为卖家 2为区总
            name: "xxx"
        }
    },
    getters,
    mutations,
    actions
})

export default store
