import apiPath from './api-path'

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
    getTasks,
    getJobs,
    getJobProcess,
    getErrorLogs
}

export default utils
