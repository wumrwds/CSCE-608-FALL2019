import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// const Index = () => import(/* webpackChunkName: "index" */ '../components/Index.vue')
const Overview = () => import(/* webpackChunkName: "index" */ '../components/common/Overview.vue')
const ErrorLogs = () => import(/* webpackChunkName: "index" */ '../components/common/ErrorLogs.vue')
const Tasks = () => import(/* webpackChunkName: "index" */ '../components/common/Tasks.vue')
const Jobs = () => import(/* webpackChunkName: "index" */ '../components/common/Jobs.vue')

const routes = [
    {
        path: '/index',
        name: 'index',
        // component: Jobs
        redirect: {
            name: 'jobs'
        }
    },
    {
        path: '/',
        redirect: {
            name: 'index'
        }
    },
    {
        path: '/overview',
        name: "overview",
        component: Overview
    },
    {
        path: '/errors',
        name: "errors",
        component: ErrorLogs
    },
    {
        path: '/tasks',
        name: "tasks",
        component: Tasks
    },
    {
        path: '/jobs',
        name: "jobs",
        component: Jobs
    }
]

export default new Router({
    routes,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    strict: process.env.NODE_ENV !== 'production'
})
