<template>
	<el-container>
		<el-header>
			<app-header></app-header>
		</el-header>
		<div class="main">
			<el-scrollbar class="left-aside" style="height:100%">
				<el-aside style="width:250px">
					<left-tree></left-tree>
				</el-aside>
			</el-scrollbar>
			<el-main class="content-container">
				<div class="container-box">
					<router-view></router-view>
				</div>
			</el-main>
		</div>
	</el-container>
</template>

<script>
import AppHeader from './AppHeader.vue'
import LeftTree from './LeftTree.vue'
export default {
    name: "app",
    data: () => ({

    }),
    methods: {

    },
    components: {
        AppHeader,
        LeftTree
    }
}
</script>

<style lang="scss" scoped>
.el-container{
    min-width: 1080px;
    height: 100%;
	overflow-x: hidden;
}
.el-header{
	height: 60px;
	background-color:rgba(0, 40, 77, 1);
	color:#fff;
	&:hover{
		background-color:rgba(0, 40, 77, 1);
	}
}

.el-scrollbar{
	height: 100%;
	.el-scrollbar__wrap{
		overflow-x: hidden!important;
	}
}
.main{
	display: flex;
    position: absolute;
    top: 60px;
    bottom: 0;
	overflow: hidden;
	width: 100%;
	height: calc(100% - 60px);
	.left-aside{
		color: #fff;
		background-color: rgba(0, 21, 41, 1);
		height: 100%;
		.el-scrollbar__wrap{
			overflow-x:hidden!important;
			overflow-y: auto;
			height: 100%;
			.el-scrollbar__view{
				height: 100%;
				.el-aside{
					height: 100%;
					flex: 0 0 250px;
					width: 250px;
					.el-menu{
						border-right: none;
					}
				}
			}
		}
	}

	.content-container{
		flex: 1;
		width: 100%;
		background-color: rgba(240, 242, 245, 1);
		overflow-y: hidden;
		.container-box{
			height: 100%;
			background-color: #fff;
			overflow: auto;
		}
	}
}

</style>
