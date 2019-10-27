<template>
	<el-menu
        :default-active= "activeIndex"
        background-color="rgba(0, 21, 41, 1)"
        class="el-menu-vertical-demo">
		<div v-for="(value,index) in leftTreeDatas" :key="index" >
			<el-submenu :index="index.toString()" v-if="value.children" @click="clickHandler(value.href)">
				<template slot="title">
					<i :class="value.iconClass"></i>
					<span>{{value.title}}</span>
				</template>
				<el-menu-item :index="index.toString()+'-'+indexs.toString()" v-for="(values,indexs) in value.children" :key="indexs" @click="clickHandler(values.href)" :class="{'is-active':getRouter==values.href}">{{values.title}}</el-menu-item>
			</el-submenu>
			<el-menu-item :index="index.toString()" v-else @click="clickHandler(value.href)" :class="{'is-active':getRouter.split('/')[2]===value.href.split('/')[2]}">
				<i :class="value.iconClass"></i>
				<span slot="title">{{value.title}}</span>
			</el-menu-item>
		</div>
	</el-menu>
</template>

<script>
import leftTreeDatas from "../asserts/data/leftTree.json"
export default {
    data () {
        return {
            leftTreeDatas: leftTreeDatas,
            activeIndex: ''
        }
    },
    watch: {
        '$route' (to, from) {
            this.getActiveIndex()
        }
    },
    methods: {
        clickHandler (href) {
            if (href) {
                this.$router.push(href)
            }
        },
        getActiveIndex () {
            this.leftTreeDatas.forEach((data, item) => {
                if (data.children) {
                    data.children.forEach((value, index) => {
                        if (value.href === this.getRouter) this.activeIndex = item + '-' + index
                    })
                } else {
                    if (data.href === this.getRouter) this.activeIndex = item.toString()
                }
            })
        }
    },
    computed: {
        getRouter () {
            return this.$route.path
        }
    },
    mounted () {
        this.getActiveIndex()
    }
}
</script>

<style lang="scss" scoped>
.el-menu{
    color: #fff;
    border-right: none;
}
.el-submenu__title span {
    color: #fff;
}
.el-menu--inline {
    .el-menu-item {
        color: #fff;
        &:hover {
            color: #fff;
            background-color: rgba(24, 144, 255, 1)!important
        }
    }
}

.el-menu-item{
    color: #fff;
    &:hover {
        color: #fff;
        background-color: rgba(24, 144, 255, 1)!important
    }
}
.el-submenu__title{
    &:hover {
       color: #fff;
       background-color: rgba(24, 144, 255, 1)!important
   }
}
// .el-submenu__title{
//      &:hover {
//         color: #fff;
//         background-color: rgba(24, 144, 255, 1)!important
//     }
// }
// .el-submenu{
//     .el-submenu__title{
//         &:hover {
//             color: #fff;
//             background-color: rgba(24, 144, 255, 1)!important
//         }
//     }
// }
.el-menu--inline {
    .is-active {
        background-color: rgba(24, 144, 255, 1)!important
    }
}
</style>
