<template>
    <div class="list">
        <el-scrollbar class="page-component__scroll">
            <el-main>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{path:'/'}">Home</el-breadcrumb-item>
                    <el-breadcrumb-item>Article</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{path:'/user'}">Query Articles</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="title-section">
                    <div class="item-group">
                        <label>Username：</label>
                        <!-- <el-autocomplete
                        class="inline-input"
                        v-model="state1"
                        :fetch-suggestions="queryUsers"
                        placeholder="请输入内容"
                        @select="handleSelect">
                        </el-autocomplete> -->
                        <el-input
                            placeholder="please input the username"
                            v-model="username"
                            clearable>
                        </el-input>
                    </div>
                    <div class="item-group">
                        <label>Category ID:</label>
                        <el-select v-model="Id" placeholder="please select the category">
                            <el-option
                            v-for="item in categoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                    <el-button type="primary" class="query-button" @click="queryArticles">Query</el-button>
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
                        min-width="60"
                        label="Article ID">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="80"
                        prop="username"
                        label="Username">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="80"
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
                        min-width="400"
                        prop="body"
                        label="body">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="120"
                        prop="categoryName"
                        label="categoryName">
                        <template slot-scope="scope">
                            {{scope.row.categoryName | nullToDash}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="78"
                        prop="createdTime"
                        label="createdTime">
                        <template slot-scope="scope">
                            {{scope.row.createdTime | longToDateTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="78"
                        prop="updatedTime"
                        label="updatedTime">
                        <template slot-scope="scope">
                            {{scope.row.updatedTime | longToDateTime}}
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
            categoryId: '',
            categoryOptions: [
                {
                    value: null,
                    label: 'Any Category'
                },
                {
                    value: 0,
                    label: 'Common User'
                },
                {
                    value: 1,
                    label: 'Administrator'
                }
            ],
            show: false,
            businessTm: '',
            tableData: [
                // {
                //     id: "1",
                //     username: "a",
                //     title: "test",
                //     description: "asdasdasdas",
                //     body: "asd",
                //     categoryName: "vxcvsdfb",
                //     createdTime: "2019-11-10 00:10:38",
                //     updatedTime: "2019-11-12 07:46:54"
                // }
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
            this.queryArticles()
            console.log(`当前页: ${val}`)
        },
        handleEdit (index, row) {
            this.$router.push({path: '/add'})
            console.log(index, row)
        },
        handleDelete (index, row) {
            this.tableData.splice(index, 1)
        },

        queryArticles () {
            let option = {
                page: this.pageData.currentPage,
                size: this.pageData.pageSize
            }

            if (this.username !== null && this.username !== undefined && this.username.split(" ").join("").length !== 0) {
                option.username = this.username
            }

            if (this.categoryId !== null && this.categoryId !== undefined) {
                option.categoryId = this.categoryId
            }

            apiUtil.getArticles(this, option).then((res) => {
                if (res.body.success === true) {
                    this.pageData.total = res.body.result.total

                    // format data list
                    this.tableData = res.body.result.list
                } else {
                    this.$message.error(res.body.errorMessage)
                }
            }, (err) => {
                this.$message.error(err.body.errorMessage)
            })
        },

        createFilter (queryString) {
            return (user) => {
                return (user.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
            }
        },

        handleSelect (item) {
            console.log(item)
        }
    },

    mounted () {
        if (this.$route.params.username !== undefined && this.$route.params.username !== null) {
            this.username = this.$route.params.username.toString()
        }

        this.queryArticles()
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
