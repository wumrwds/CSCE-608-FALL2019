<template>
    <div class="list">
        <el-scrollbar class="page-component__scroll">
            <el-main>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>任务管理</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{path:'/tasks'}">任务列表</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="title-section">
                    <div class="item-group">
                        <label>任务名称：</label>
                        <el-input
                            placeholder="请输入内容"
                            v-model="taskName"
                            clearable>
                        </el-input>
                    </div>
                    <div class="item-group">
                        <label>任务状态： </label>
                        <el-select v-model="status" placeholder="请选择">
                            <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                    <el-button type="primary" class="query-button" @click="queryTasks">查询</el-button>
                </div>

                <el-table
                    :data="tableData"
                    :header-cell-style="{color:'#48576a'}"
                    style="width: 100%;">
                    <el-table-column
                        align="center"
                        prop="id"
                        label="任务ID">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="name"
                        label="任务名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="topology"
                        label="拓扑结构">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="cronExp"
                        label="调度信息">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="status"
                        label="状态">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="description"
                        label="任务描述">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="updateTime"
                        label="最近修改时间">
                    </el-table-column>
                    <el-table-column label="操作" width=“180” align="center">
                        <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="queryJobByTaskId(scope.row.id)">查看实例</el-button>
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
                pageSize: 10,
                total: 1
            },
            taskName: '',
            status: null,
            statusOptions: [
                {
                    value: null,
                    label: '全部'
                },
                {
                    value: true,
                    label: '正常'
                },
                {
                    value: false,
                    label: '未启用'
                }
            ],
            tableData: []
        }
    },

    methods: {
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange (val) {
            this.queryTasks()
            console.log(`当前页: ${val}`)
        },
        // handleEdit (index, row) {
        //     this.$router.push({path: '/jobs'})
        //     console.log(index, row)
        // },
        // handleDelete (index, row) {
        //     this.tableData.splice(index, 1)
        // },

        queryTasks () {
            let option = {
                page: this.pageData.currentPage,
                size: this.pageData.pageSize
            }

            if (this.taskName !== null && this.taskName !== undefined && this.taskName.split(" ").join("").length !== 0) {
                option.taskName = this.taskName
            }

            if (this.status !== null && this.status !== undefined) {
                option.status = this.status
            }

            apiUtil.getTasks(this, option).then((res) => {
                if (res.body.success === true) {
                    this.pageData.total = res.body.obj.total

                    // format data list
                    this.formatData(res.body.obj.list)
                    this.tableData = res.body.obj.list
                } else {
                    this.$message.error(res.body.errorMessage)
                }
            }, (err) => {
                this.$message.error(err.statusText)
            })
        },
        queryJobByTaskId (taskId) {
            this.$router.push({name: 'jobs', params: {taskId: taskId}})

            console.log(taskId)
        },

        formatData (data) {
            data.forEach(row => {
                row.status = row.status ? '正常' : '未启用'

                let updateTm = new Date(row.updateTime)
                row.updateTime = formatDate(updateTm, "yyyy-MM-dd hh:mm:ss")
            })
        }
    },

    mounted () {
        this.queryTasks()
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
