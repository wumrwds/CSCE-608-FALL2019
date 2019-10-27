import 'babel-polyfill'
import Vue from 'vue'
import App from './components/App.vue'
import store from './store'
import router from './routes'
import VueResource from 'vue-resource'
import Vuelidate from 'vuelidate'
import ElementUI from 'element-ui'
import './css/index.scss'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(Vuelidate)

window.app = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
