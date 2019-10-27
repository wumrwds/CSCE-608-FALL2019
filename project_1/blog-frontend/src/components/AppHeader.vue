<template lang="html">
	<div :class="{'index-nav': true, 'index-nav-background': scrollTop}">
		<el-row class="container">
			<el-col :span="5" class="header-title">
				Blog Backend Management System
			</el-col>
			<el-col :span="12"></el-col>

			<!-- <el-col :span="3" class="user">
				<div class="login" @click="clickConsole()">
					<a class="logo">{{isLogin?'退出':'登录'}}</a>
				</div>
				<div class="user-type" v-show="isLogin">
					<div>{{userName}}</div>
				</div>
			</el-col> -->
		</el-row>
		<el-dialog ref="console_modal"
			:visible="isShowLoginDialog"
			@close = "closeDialog"
			width="400px">
			<base-login :handleData="handleData"></base-login>
		</el-dialog>

	</div>
</template>
<script>
import BaseLogin from './common/BaseLogin.vue'
export default {
    // name: "app-header",
    components: {
        BaseLogin
    },
    data () {
        return {
            activeIndex: "1",
            scrollTop: 0,
            handleData: {
                isLoginPage: 'index',
                clickType: ''
            }
        }
    },
    methods: {
        clickConsole () {
            if (!this.isLogin) {
                this.$store.commit('changeShowLoginDialog', true)
            } else {
                this.$store.commit('changeLogin', false)
                return false
            }
        },
        handleScroll () {
            this.scrollTop = this.$parent.$parent.$parent.$el.scrollTop
        },
        closeDialog () {
            this.$store.commit('changeShowLoginDialog', false)
        }
    },
    mounted () {
        window.addEventListener('scroll', this.handleScroll, true)
    },

    computed: {
        isLogin () {
            return this.$store.state.isLogin
        },
        isShowLoginDialog () {
            return this.$store.state.isShowLoginDialog
        },
        userName () {
            return this.$store.state.userInfo.name
        },
        userType () {
            return this.$store.state.userInfo.type
        }
    }
}
</script>

<style lang="scss" scoped>
.index-nav-background{
    background-color:rgba(0, 40, 77, 1);
}
.index-nav{
    z-index: 10;
	width: 100%;
	background-color: transparent;
	margin: 0 auto;
    height: 60px;
    line-height: 60px;
    color: #fff;
    box-sizing: border-box;
	font-size: 14px;
	.header-title{
		font-size: 18px;
	}
	&:hover{
		background-color:rgba(0, 40, 77, 1);
	}
	.logo {
		cursor: pointer;
		text-decoration: none;
		line-height: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		padding-left: 14px;
		text-decoration: none;
		img {
			height: 42px;
		}
		span {
			color: #fff;
			font-size: 16px;
			padding-left: 3px;
		}
	}
	img {
		display: block;
		margin-top: 3px;
		width: 94.5px;
		height: 29px;
	}
	.el-menu--horizontal {
		border-right: none;
		border-bottom: none;
		>.el-submenu .el-submenu__title {
			height: 68px;
			line-height: 68px;
			border-bottom: none;
			color: #909399;
		}
	}

	.user {
		float: right;
		.login {
			float: right;
			color: #fff;
			cursor: pointer;
			a {
				color: #fff;
				text-decoration: none;
				&:hover {
					color: #389CFF;
				}
			}
		}
		.console {
			float: right;
			cursor: pointer;
			a {
				border: 1px solid hsla(0,0%,100%,.2);
				color: #fff;
				padding: 4px 15px;
				border-radius: 4px;
				margin-right: 15px;
				&:hover {
					color: #389CFF;
				}
			}
		}
		.user-type {
			float: right;
			cursor: pointer;
			margin-right: 15px;
			position: relative;
			color: #fff;
			&:hover {
				color: #389CFF;
				ul{
					display: block;
				}
			}
			i {
				margin-left: 5px;
			}
			ul {
				display: none;
				color: #fff;
				width: 80px;
				text-align: center;
				z-index: 222;
				background-color: #222;
				position: absolute;
				transition: all 0.3s;
				left: -20px;
				top: 60px;
                line-height: 20px;
				> li {
					width: 100%;
					box-sizing: border-box;
					padding: 0;
					color: #fff;
					a {
						cursor: pointer;
						text-decoration: none;
						padding: 10px 20px;
						display:inline-block;
						color: #fff;
						&.active {
							color: #389CFF;
						}
					}

				}
			}
		}
	}
}
@media (max-width: 1249px){
	.index-nav {
		width: 1080px!important;
		margin: 0 auto;
	}
}

</style>
