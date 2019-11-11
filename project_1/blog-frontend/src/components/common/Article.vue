<template>
    <div class="list">
        <el-scrollbar class="page-component__scroll">
            <el-main>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{path:'/'}">Home</el-breadcrumb-item>
                    <el-breadcrumb-item>Article</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{path:'/user'}">Article List</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="title-section">
                    <div class="item-group">
                        <label>Username：</label>
                        <el-input
                            placeholder="please input the username"
                            v-model="username"
                            clearable>
                        </el-input>
                    </div>
                    <div class="item-group">
                        <label>Category:</label>
                        <el-input
                            placeholder="please input the category"
                            v-model="category"
                            clearable>
                        </el-input>
                    </div>
                    <!-- <div class="item-group">
                        <label>User Type</label>
                        <el-select v-model="status" placeholder="please select">
                            <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div> -->
                    <!-- <div class="item-group">
                        <label>业务时间：</label>
                        <el-input
                            placeholder="请输入业务时间"
                            v-model="businessTm"
                            clearable>
                        </el-input>
                    </div> -->

                    <el-button type="primary" class="query-button" @click="queryJobs">Query</el-button>
                    <!-- <el-button type="primary" class="add-button"><router-link to="/add">新增</router-link></el-button> -->
                </div>

                <el-table
                    border
                    :data="tableData"
                    :header-cell-style="{color:'#48576a'}"
                    style="width: 100%;">
                    <el-table-column
                        align="center"
                        prop="id"
                        label="Article ID">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="100"
                        prop="username"
                        label="Username">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="100"
                        prop="title"
                        label="Title">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="120"
                        prop="description"
                        label="description">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="200"
                        prop="body"
                        label="body">

                        <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="queryJobProcess(scope.row.id)">view body</el-button>
                        </template>
                        
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="150"
                        prop="createdTime"
                        label="createdTime">
                        <template slot-scope="scope">
                            {{scope.row.startTime | longToDateTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="150"
                        prop="updatedTime"
                        label="updatedTime">
                        <template slot-scope="scope">
                            {{scope.row.finishTime | longToDateTime}}
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

        <el-dialog title="运行情况" :visible.sync="processTableVisible" width="78%" >
            <el-table :data="processData">
                <el-table-column property="jobId" label="实例ID" width="185"></el-table-column>
                <el-table-column property="success" label="成功"></el-table-column>
                <el-table-column property="failed" label="失败"></el-table-column>
                <el-table-column property="solved" label="已处理"></el-table-column>
                <el-table-column property="total" label="总数"></el-table-column>
                <el-table-column property="complete" label="进度"></el-table-column>
                <el-table-column property="avgSpeed" label="平均计算耗时" width="120"></el-table-column>
                <el-table-column property="duration" label="已耗时"></el-table-column>
                <el-table-column property="timeLeft" label="剩余时间"></el-table-column>
                <el-table-column property="createTime" label="开始时间" width="140">
                    <template slot-scope="scope">{{scope.row.createTime | longToDateTime}}</template>
                </el-table-column>
                <el-table-column property="updateTime" label="最近更新" width="140">
                    <template slot-scope="scope">{{scope.row.updateTime | longToDateTime}}</template>
                </el-table-column>
            </el-table>
        </el-dialog>
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
            username: '',
            status: null,
            show: false,
            statusOptions: [
                {
                    value: null,
                    label: 'ALl'
                },
                {
                    value: 0,
                    label: 'A'
                },
                {
                    value: 1,
                    label: 'B'
                },
                {
                    value: 2,
                    label: 'C'
                },
                {
                    value: 3,
                    label: 'D'
                }
            ],
            businessTm: '',
            tableData: [
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                },
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                },
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                },
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                },
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                },
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                },
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                },
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                },
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                },
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                },
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                },
                {
                    id: "1",
                    username: "a",
                    nickname: "a",
                    email: "wumrwds@gmail.com",
                    description: "asdasdasdas",
                    avatar: "C:/asdasdsad.txt"
                }
            ],
            processTableVisible: false,
            processData: []
        }
    },

    filters: {
        longToDateTime (dateLong) {
            if (dateLong === null || dateLong === undefined) {
                return '---'
            }

            let date = new Date(dateLong)

            return formatDate(date, "yyyy-MM-dd hh:mm:ss")
        },

        nullToDash (val) {
            if (val === null || val === undefined || ((val instanceof String) && val.split(" ").join("").length === 0)) {
                return '---'
            }

            return val
        }
    },

    methods: {
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange (val) {
            this.queryJobs()
            console.log(`当前页: ${val}`)
        },
        handleEdit (index, row) {
            this.$router.push({path: '/add'})
            console.log(index, row)
        },
        handleDelete (index, row) {
            this.tableData.splice(index, 1)
        },

        queryJobs () {
            let option = {
                page: this.pageData.currentPage,
                size: this.pageData.pageSize
            }

            if (this.username !== null && this.username !== undefined && this.username.split(" ").join("").length !== 0) {
                option.username = this.username
            }

            if (this.status !== null && this.status !== undefined) {
                option.status = this.status
            }

            if (this.businessTm !== null && this.businessTm !== undefined && this.businessTm.split(" ").join("").length !== 0) {
                option.businessTm = this.businessTm
            }

            apiUtil.getJobs(this, option).then((res) => {
                if (res.body.success === true) {
                    this.pageData.total = res.body.obj.total

                    // format data list
                    this.tableData = res.body.obj.list
                } else {
                    this.$message.error(res.body.errorMessage)
                }
            }, (err) => {
                this.$message.error(err.body.errorMessage)
            })
        },

        queryJobProcess (jobId) {
            this.processTableVisible = true

            apiUtil.getJobProcess(this, jobId).then((res) => {
                if (res.body.success === true) {
                    this.processData = [res.body.obj]
                } else {
                    this.$message.error(res.body.errorMessage)
                }
            }, (err) => {
                this.$message.error(err.body.errorMessage)
            })
        },

        queryErrorLogsByJob (jobId) {
            this.$router.push({name: 'errors', params: {jobId: jobId}})
        }
    },

    mounted () {
        if (this.$route.params.username !== undefined && this.$route.params.username !== null) {
            this.username = this.$route.params.username.toString()
        }

        this.queryJobs()
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
