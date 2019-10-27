// import mutationTypes from './mutation-types.js'

const mutations = {
    changeLogin (state, isLogin) {
        state.isLogin = isLogin
    },
    changeShowLoginDialog (state, isShowLoginDialog) {
        state.isShowLoginDialog = isShowLoginDialog
    },
    changeUserInfo (state, userInfo) {
        state.userInfo.type = userInfo.type || state.userInfo.type
        state.userInfo.name = userInfo.name || state.userInfo.name
    }
}
export default mutations
