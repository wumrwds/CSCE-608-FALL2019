<template>
   <div class="add">
        <el-scrollbar class="page-component__scroll">
            <el-main>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{path:'/'}" >一级目录</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{path:'/add'}">add</el-breadcrumb-item>
                </el-breadcrumb>
                <el-form class="el-form" status-icon ref="form" :model="form"  :rules="rules"   label-width="156px">
                    <label class="form_title">区域一</label>
                    <el-form-item label="下拉框" prop="selectValue">
                        <el-select v-model="form.selectValue" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="输入框" prop="inputValue">
                        <el-input class="el-input" v-model="form.inputValue"  type="inputValue" placeholder="必填且校验位数为1-20位"></el-input>
                    </el-form-item>

                    <el-form-item label="工号" prop="num">
                        <el-input class="el-input" v-model="form.num" maxlength="8" minlength="6" type="num" ></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="phone">
                        <el-input class="el-input" v-model="form.phone" maxlength="11"  type="phone" ></el-input>
                    </el-form-item>
                    <el-form-item label="日期" required >
                        <el-col :span="11">
                            <el-form-item prop="startData">
                                <el-date-picker
                                type="date"
                                placeholder="选择今天之后的日期"
                                v-model="form.startData"
                                :picker-options="pickerOptions"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <div class="form_split"></div>

                    <label class="form_title">区域二</label>
                    <el-form-item label="switch" prop="switchData">
                        <el-switch v-model="form.switchData"></el-switch>
                    </el-form-item>
                     <el-form-item label="radio" prop="radioData">
                        <el-radio-group v-model="form.radioData">
                        <el-radio label="选项一"></el-radio>
                        <el-radio label="选项二"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="上传">
                        <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :before-upload="beforeAvatarUpload"
                        :on-preview="handlePreviewProcess"
                        :on-remove="handleRemoveProcess"
                        :before-remove="beforeRemoveProcess"
                        multiple
                        :limit="3"
                        :on-exceed="handleExceedProcess"
                        :file-list="form.useProcess">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传visio,doc,docx,xls,xlsx,jpg,png文件，且不超过20M</div>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="多选框">
                        <el-checkbox-group v-model="form.checkBoxData">
                            <el-checkbox label="APP" name="checkBoxData"></el-checkbox>
                            <el-checkbox label="WEB" name="checkBoxData"></el-checkbox>
                            <el-checkbox label="H5" name="checkBoxData"></el-checkbox>
                            <el-checkbox label="小程序" name="checkBoxData"></el-checkbox>
                            <el-checkbox label="其他" name="checkBoxData"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                     <el-form-item label="textarea" prop="textareaData">
                        <div class="textarea_num"><label>{{form.textareaDataNum}}</label><label>/200</label></div>
                        <el-input class="el_textarea"  :rows="4"  @keyup.native="form.textareaDataNum = form.textareaData.length" type="textarea" v-model="form.textareaData" maxlength="200"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button >取消</el-button>
                        <el-button type="primary" @click="onSubmit(form)">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-scrollbar>
   </div>
</template>
<script>

export default {
    data () {
        return {
            dialogVisible: false,
            pageData: {
                type: 'index',
                banner: {
                    imageUrl: 'images/index/banner.png',
                    title: '丰策平台',
                    describe: '数据洞察先机，智慧决策未来！'
                }
            },
            form: {
                selectValue: '',

                inputValue: '',
                num: '',
                phone: '',
                startData: '',
                switchData: false,

                textareaData: '',
                textareaDataNum: 0,
                checkBoxData: []

            },
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() < Date.now() - 8.64e7
                }
            },
            rules: {
                selectValue: [
                    { required: true, message: '请选择XXX', trigger: 'change' }
                ],

                inputValue: [
                    { required: true, message: '请输入XXX', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 位', trigger: 'blur' }
                ],
                num: [
                    { validator: this.checknum, trigger: 'blur' },
                    { required: true, message: '请输入工号', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { validator: this.checkphone, trigger: 'blur' }
                ],
                startData: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                radioData: [
                    { required: true, message: '请选择XXX', trigger: 'change' }
                ],
                textareaData: [
                    { required: true, message: '请输入XXXX', trigger: 'blur' }
                ]

            }
        }
    },

    methods: {
        /**
         * 工号校验
         */
        checknum (rule, value, callback) {
            if (!value) {
                return callback(new Error('请输入工号'))
            } else {
                let Reg1 = /^\d{6}$/g
                let Reg2 = /^\d{8}$/g
                if (!Reg1.test(value) && !Reg2.test(value)) {
                    return callback(new Error('工号只能为6位或8位数字'))
                } else {
                    return callback()
                }
            }
        },
        /**
         * 电话校验
         */
        checkphone (rule, value, callback) {
            if (!value) {
                return callback(new Error('请输入电话'))
            } else {
                var Reg = /^1(3|4|5|7|8|9)\d{9}$/g
                if (!Reg.test(value)) {
                    return callback(new Error('请输入正确的11位电话'))
                } else {
                    return callback()
                }
            }
        },
        /**
         * 校验上传文件格式和大小
         */
        beforeAvatarUpload (file) {
            let isFileType = false
            const isLt2M = file.size / 1024 / 1024 < 20
            const type = file.name.split('.')[1]
            if (type === 'visio' || type === 'doc' || type === 'docx' || type === 'xls' || type === 'xlsx' || type === 'jpg' || type === 'png') {
                isFileType = true
            }
            if (!isFileType) {
                this.$message.error('只能上传visio,doc,docx,xls,xlsx,jpg,png格式文件!')
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 20MB!')
            }
            return isFileType && isLt2M
        },
        /** 使用流程 上传文件处理 start */
        handlePreviewProcess (file) {
            console.log(file)
        },
        handleRemoveProcess (file, fileList) {
            console.log(file, fileList)
        },
        beforeRemoveProcess (file, fileList) {
            if (file && file.status === "success") {
                return this.$confirm('确定移除' + file.name + '？')
            }
        },
        handleExceedProcess (files, fileList) {
            this.$message.warning('当前限制选择 3 个文件，本次选择了' + files.length + '个文件，共选择了' + files.length + fileList.length + '个文件')
        },
        /** 使用流程 上传文件处理 end */

        /**
         * 返回上一页
         */
        goBack () {
            this.$router.go(-1)
        },
        /**
         * 提交校验
         */
        onSubmit (form) {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$router.push({path: '/buyer-center/consultation-list'})
                    alert('submit!')
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.add{
    height: 100%;
    color: #48576a;
    .page-component__scroll{
        height: 100%;
        .el-breadcrumb{
            padding-bottom: 20px;
            border-bottom: 1px solid #ebeef5;
        }
    }
    .header-box {
		background-image: linear-gradient(-180deg, rgba(37,30,71,.9) 0%, rgba(36,83,155,.9) 100%);
		@media (max-width: 1249px) {
			width: 1080px !important;
			margin: 0 auto;
			}
        }

    .el-form{
        .el-form-item__content{
            font-size: 12px;
        }
        .form_title{
            color: #303133;
            font-weight: 700;
            font-size: 14px;
            width: 100px;
            text-align: center;
            display: inline-block;
            margin-top: 16px;
            margin-bottom: 20px;
        }
        .left-label{
            text-align:left;
        }
        .form_split{
            border-bottom: 1px solid #ececec;
        }
        .form_type_tip{
            color: #aaa;
            font-size: 12px;
            margin-left: 20px;
        }
        .el-input{
            width: 340px;
            font-size: 12px;
        }
        .el_textarea{
            width: 600px;
        }
        .textarea_num{
            position: absolute;
            bottom: 0px;
            left:525px;
            color: #606266;
        }
        .upload-demo{
            width: 40%;
        }
        .el-button{
            font-size: 12px;
        }
    }
}

</style>
