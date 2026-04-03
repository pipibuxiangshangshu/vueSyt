<template>
    <div class="search">
        <el-autocomplete hide-loading=true @select="goDetail" trigger-on-focus=false clearable placeholder="请输入医院名称" class="form" v-model="hosname"
            :fetch-suggestions="fetchData" />
        <el-button type="primary" :icon="Search" style="width: 100px; height: 32px;">搜索</el-button>
    </div>
</template>
<script setup lang="ts">
//引入搜索按钮图标
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
//引入请求方法
import { reqHospitalInfo } from '@/api/home/index'
import type { HospitalInfo} from '@/api/home/type.ts'
//创建路由器对象
let $router = useRouter()
//收集搜索的关键字(医院的名字)
let hosname = ref<string>('')
//获取顶部组件的回调
const fetchData = async (keyword: string, cb: any) => {
    //当用户输入完成关键字函数会执行一次，发请求获取需要展示的数据即可
    let result: HospitalInfo = await reqHospitalInfo(keyword)
    //整理数据变成组件需要的数据格式
    let showData = result.data.map(item => {
        return {
            value: item.hosname, //展示医院的名字
            hoscode: item.hoscode//存储医院编码
        }
    })
    //给组件提供展示的数组
    cb(showData)
}
//点击推荐项触发的事件
const goDetail =(item:any)=>{
    //点击推荐项进入医院详情页，将来需要携带query参数(医院编码)
    $router.push({path:'/hospital/register',query:{hoscode:item.hoscode}})
}

//深度选择器:>>>  /deep/  ::v-deep
</script>
<style scoped lang="scss">
.search {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0px;

    ::v-deep(.form) {
        width: 600px;
        margin-right: 10px;
    }
}
</style>