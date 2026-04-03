<template>
    <div class="hospital">
        <!--左侧导航区-->
        <div class="menu">
            <div class="top">
                <el-icon><HomeFilled /></el-icon>
                <span>/ 医院信息</span>
            </div>
            <el-menu :default-active="$route.path" class="el-menu-vertical-demo">
                <el-menu-item index="/hospital/register" @click="changeAcitve('/hospital/register')">
                    <el-icon><icon-menu /></el-icon>
                    <span>预约挂号</span>
                </el-menu-item>
                <el-menu-item index="/hospital/detail" @click="changeAcitve('/hospital/detail')">
                    <el-icon>
                        <document />
                    </el-icon>
                    <span>医院详情</span>
                </el-menu-item>
                <el-menu-item index="/hospital/notice" @click="changeAcitve('/hospital/notice')">
                    <el-icon>
                        <setting />
                    </el-icon>
                    <span>预约通知</span>
                </el-menu-item>
                <el-menu-item index="/hospital/close" @click="changeAcitve('/hospital/close')">
                    <el-icon>
                        <InfoFilled />
                    </el-icon>
                    <span>停诊信息</span>
                </el-menu-item>
                <el-menu-item index="/hospital/search" @click="changeAcitve('/hospital/search')">
                    <el-icon>
                        <Search />
                    </el-icon>
                    <span>查询/取消</span>
                </el-menu-item>
            </el-menu>
        </div>
        <!--右侧内容展示区域:路由组件展示位置-->
        <div class="content">
            <!--子组件展示结构的地方-->
            <router-view></router-view>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import useDetailStore from '@/store/modules/hospitalDetail'
//获取仓库对象
let detailStore = useDetailStore();
//引入左侧菜单图标
import {
  Document,
  Menu as IconMenu,
  InfoFilled,
  Setting,
  Search,
  HomeFilled
} from '@element-plus/icons-vue'
//引入路由器
import { useRouter,useRoute } from 'vue-router';
//获取路由器
let $router = useRouter();
//获取当前路由的信息
let $route = useRoute();
//左侧菜单点击事件的回调
const changeAcitve = (path:string)=>{
    //跳转到对应的二级路由
    $router.push({path,query:{hoscode:$route.query.hoscode}});
}
//组件挂载完毕，通知pinia仓库发送请求获取医院详情数据，存储再仓库中
onMounted(()=>{
    //获取医院详情的数据
    detailStore.getHospital($route.query.hoscode as string);
    //获取医院科室的数据
    detailStore.getDepartment($route.query.hoscode as string);
})
</script>
<style scoped lang="scss">
.hospital {
    display: flex;

    .menu {
        flex: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        .top{
            color: #7f7f7f;
            margin-bottom: 10px;
        }
    }

    .content {
        flex: 8;
    }
}
</style>