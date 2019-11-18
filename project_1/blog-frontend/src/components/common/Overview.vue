<template>
    <el-container height="100%" direction="vertical">
        <el-header height="70px" style="background-color: #B3C0D1; color: #333;text-align: center;font: 3em sans-serif;">
            <span style="vertical-align: middle">{{message}}</span>
        </el-header>
        <el-main style="background-color: #E9EEF3;color: #333;text-align: center;font: 1.5em sans-serif;">
            1. API Document: <a href="https://element.eleme.io" target="_blank">默认链接</a>
        </el-main>
    </el-container>
</template>

<script>
export default {
    data () {
        return {
            message: 'CSCE 608 Project #1'
        }
    }
}
</script>
