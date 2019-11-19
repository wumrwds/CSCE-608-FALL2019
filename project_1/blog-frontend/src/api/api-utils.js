import apiPath from './api-path'

const getUsers = (vm, option) => {
    return vm.$http.get(apiPath.userContext, {params: option})
}

const getArticles = (vm, option) => {
    return vm.$http.get(apiPath.articleContext, {params: option})
}

const getArticleIdByTitle = (vm, option) => {
    return vm.$http.get(`${apiPath.articleContext}/id`, {params: option})
}

const getComments = (vm, option) => {
    return vm.$http.get(apiPath.commentContext, {params: option})
}

const getTasks = (vm, option) => {
    return vm.$http.get(apiPath.taskContext, {params: option})
}

const getJobs = (vm, option) => {
    return vm.$http.get(apiPath.jobContext, {params: option})
}

const getJobProcess = (vm, jobId) => {
    return vm.$http.get(`${apiPath.jobContext}/${jobId}/process`)
}

const getErrorLogs = (vm, jobId, option) => {
    return vm.$http.get(`${apiPath.jobContext}/${jobId}/errors`, {params: option})
}

const utils = {
    getUsers,
    getArticles,
    getArticleIdByTitle,
    getComments,
    getTasks,
    getJobs,
    getJobProcess,
    getErrorLogs
}

export default utils
