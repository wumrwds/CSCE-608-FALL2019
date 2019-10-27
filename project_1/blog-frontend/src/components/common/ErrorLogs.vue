<template>
    <div class="list">
        <el-scrollbar class="page-component__scroll">
            <el-main>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{path:'/'}">Portal Page</el-breadcrumb-item>
                    <el-breadcrumb-item>Users</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{path:'/errors'}">User List</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="title-section">
                    <div class="item-group">
                        <label>实例ID：</label>
                        <el-input
                            placeholder="请输入内容"
                            v-model="jobId"
                            clearable>
                        </el-input>
                    </div>
                    <el-button type="primary" class="query-button" @click="queryErrorLogs">查询</el-button>
                </div>

                <el-table
                    :data="tableData"
                    :header-cell-style="{color:'#48576a'}"
                    style="width: 100%;">
                    <el-table-column
                        align="center"
                        prop="jobId"
                        label="任务ID"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="groupedKeys"
                        label="Group Key">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="log"
                        label="错误信息"
                        min-width="300">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="createTime"
                        label="时间">
                        <template slot-scope="scope">
                            {{scope.row.createTime | longToDateTime}}
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="pagination"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageData.currentPage"
                    :page-size="pageData.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pageData.total">
                </el-pagination>
            </el-main>
        </el-scrollbar>
    </div>
</template>

<script>
import apiUtil from '@/api/api-utils'
import {formatDate} from '@/js/date'
export default {
    data () {
        return {
            tabStatus: "all",
            pageData: {
                currentPage: 1,
                pageSize: 30,
                total: 1
            },
            jobId: '',
            tableData: []
        }
    },

    filters: {
        longToDateTime (dateLong) {
            if (dateLong === null || dateLong === undefined) {
                return '---'
            }

            let date = new Date(dateLong)

            return formatDate(date, "yyyy-MM-dd hh:mm:ss")
        }
    },

    methods: {
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange (val) {
            this.queryErrorLogs()
            console.log(`当前页: ${val}`)
        },
        // handleEdit (index, row) {
        //     this.$router.push({path: '/jobs'})
        //     console.log(index, row)
        // },
        // handleDelete (index, row) {
        //     this.tableData.splice(index, 1)
        // },

        queryErrorLogs () {
            let jobId = this.jobId

            let option = {
                page: this.pageData.currentPage,
                size: this.pageData.pageSize
            }

            if (jobId !== null && jobId !== undefined) {
                apiUtil.getErrorLogs(this, jobId, option).then((res) => {
                    if (res.body.success === true) {
                        this.pageData.total = res.body.obj.total

                        this.tableData = res.body.obj.list
                    } else {
                        this.$message.error(res.body.errorMessage)
                    }
                }, (err) => {
                    this.$message.error(err.body.errorMessage)
                })
            }
        }
    },

    mounted () {
        this.jobId = this.$route.params.jobId
        this.queryErrorLogs()
    }
}
</script>
<style lang="scss" scoped>

.list{
    height: 100%;
    color: #48576a;
    .header-box {
		background-image: linear-gradient(-180deg, rgba(37,30,71,.9) 0%, rgba(36,83,155,.9) 100%);
		@media (max-width: 1249px) {
            width: 1080px !important;
            margin: 0 auto;
        }
    }
    .page-component__scroll{
        height: 100%;
        .el-breadcrumb{
            padding-bottom: 20px;
            border-bottom: 1px solid #ebeef5;
        }
    }
    .el-main{
        .el-breadcrumb{
            padding-bottom: 20px;
            border-bottom: 1px solid #ebeef5;
        }
        .title-section{
            background: #f0f2f5;
            padding: 10px;
            margin: 20px 0;
            position: relative;
            color: #606266;
            .item-group{
                display: inline-block;
                margin-right: 16px;
                label{
                    padding-right: 6px;
                }
            }
            .el-radio-button__inner{
                padding: 10px
            }
            .el-input{
                width: 230px;
            }
        }
        .query-button{
            position: absolute;
            right:90px;
        }
        .add-button{
            position: absolute;
            right: 10px;
        }
        .el-button{
            a{
                text-decoration: none;
                color: #fff;
            }
            &:hover{

            }
        }
        .el-table{
            color: #606266;
            thead{
                 color: #606266;
            }
        }
        .el-pagination{
            margin-top:30px;
            text-align: right;
        }
    }
}

</style>
