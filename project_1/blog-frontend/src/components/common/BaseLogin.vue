<template>
	<div class="login">
		<div class="login-content">
			<h3 class="login-title">用户登录</h3>
			<div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" validate>
					<el-form-item  prop="account">
						<el-input placeholder="AD账号" v-model.number="ruleForm.account">
							<template slot="prepend">
								<i class="iconfont icon-user-o"></i>
							</template>
						</el-input>
					</el-form-item>
					<el-form-item  prop="password">
						<el-input placeholder="密码" v-model="ruleForm.password" type="password">
							<template slot="prepend">
								<i class="iconfont icon-unlockalt"></i>
							</template>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" style="width:100%;" @click="validateForm ('ruleForm')">登陆</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
    name: 'base-login',
    props: ['handleData'],
    data () {
        return {
            disabled: true,
            ruleForm: {
                account: '',
                password: ''
            },
            rules: {
                account: [
                    { validator: this.validateAccounts, trigger: 'blur' },
                    {type: 'number', message: '登陆帐号（工号）由6位或8位数字组成。', trigger: 'blur'}
                ],
                password: [
                    { validator: this.validatePassword, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        validateForm (ruleForm) {
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    // TODO
                    this.userLogin()
                } else {
                    return false
                }
            })
        },
        validateAccounts (rule, value, callback) {
            if (value === "") {
                callback(new Error('请输入账号'))
            } else if (value.toString().length === 6 || value.toString().length === 8) {
                callback()
            } else {
                callback(new Error('登陆帐号由6位或8位数字组成。'))
            }
        },
        validatePassword (rule, value, callback) {
            if (value === "") {
                callback(new Error('请输入密码'))
            } else if (value.length >= 10) {
                callback()
            } else {
                callback(new Error('密码长度应大于10位'))
            }
        },
        userLogin () {
            if (this.handleData.isLoginPage === 'index') {
                this.$router.push('/index')
            }
            this.$store.commit('changeLogin', true)
            this.$store.commit('changeUserInfo', {type: '0', name: 'XXXXXX'})
            this.$store.commit('changeShowLoginDialog', false)
        }
    }
}
</script>

<style lang="scss" scoped>
@import url('../../css/iconfont.css');
.login {
	width: 100%;
	height: auto;
	.login-content {
		padding: 0 25px;
		margin-bottom: 25px;
		h3 {
			margin-bottom: 25px;
			color: #333;
			font-size: 16px;
			line-height: 25px;
		}
		div {
			i {
				color: #20a0ff;
				font-size: 18px;
			}
		}
	}
}
</style>
