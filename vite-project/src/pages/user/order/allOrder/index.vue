<template>
    <!--展示全部订单-->
    <el-card style="max-width: 850px">
        <template #header>
            <div class="card-header">
                <span>挂号订单</span>
            </div>
        </template>
        <!--提供用户选择的下拉菜单-->
        <el-form :inline="true">
            <el-form-item label="就诊人" style="width: 40%">
                <el-select placeholder="请选择就诊人" v-model="patientId" @change="changeUser">
                    <el-option label="选择所有就诊人" value=""></el-option>
                    <el-option v-for="item in allUser" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单状态" style="width: 45%">
                <el-select placeholder="请选择订单状态" v-model="orderStatus" @change="changeOrderState">
                    <el-option  label="全部订单" value=""></el-option>
                    <el-option v-for="(item,index) in allOrderState" :key="index" :label="item.comment" :value="item.status"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <!--表格展示订单的数据-->
        <el-table border style="margin: 20px 0px" :data="AllOrderArr">
            <el-table-column label="就诊时间" prop="reserveDate"></el-table-column>
            <el-table-column label="医院" prop="hosname"></el-table-column>
            <el-table-column label="科室" prop="depname"></el-table-column>
            <el-table-column label="医生" prop="title"></el-table-column>
            <el-table-column label="医事服务费" prop="amount"></el-table-column>
            <el-table-column label="就诊人" prop="patientName"></el-table-column>
            <el-table-column label="订单状态" prop="param.orderStatusString"></el-table-column>
            <el-table-column label="操作">
                <template #="{ row }">
                    <el-button style="color: #3E9EFD;" type="text" @click="goDetail(row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页器-->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout=" prev, pager, next,->,sizes,total" :total="total" @current-change="handler"
            @size-change="changePageSize" />
    </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
//引入获取所有订单请求方法
import { reqUserOrderInfo, reqAllUser, reqOrderState } from '@/api/user';
import { useRouter } from 'vue-router';
//获取路由器对象
let $router = useRouter()
//引入ts类型
import {
    UserOrderInfoResponseData, records, AllUserResponseData, AllOrderStateResponseData
    , AllUser,AllOrderState
} from '@/api/user/type';
//当前分页器的页码
let pageNo = ref<number>(1)
//当前页码展示几条数据
let pageSize = ref<number>(10)
//收集就诊人id
let patientId = ref<string>('')
//订单状态
let orderStatus = ref<string>('')
//存储全部的订单
let AllOrderArr = ref<records>([])
//存储订单的总个数
let total = ref<number>(0)
//存储全部就诊人信息
let allUser = ref<AllUser>([])
//存储全部订单的状态
let allOrderState = ref<AllOrderState>([])
//组件挂载完毕的钩子
onMounted(() => {
    //获取订单的方法
    getOrderInfo()
    //获取全部就诊人的信息以及全部的订单状态
    getData()
})
//获取订单的方法
const getOrderInfo = async () => {
    let result: UserOrderInfoResponseData = await reqUserOrderInfo(pageNo.value, pageSize.value, patientId.value, orderStatus.value);
    if (result.code == 200) {
        AllOrderArr.value = result.data.records
        total.value = result.data.total
    }
}
//详情按钮的点击回调
const goDetail = (row: any) => {
    $router.push({ path: '/user/order', query: { orderId: row.id } })
}
//分页器组件当前页码事件回调
const handler = (pager: number) => {
    pageNo.value = pager;
    getOrderInfo()
}
const changePageSize = (pageSizes: number) => {
    pageSize.value = pageSizes
    getOrderInfo()
}
//获取就诊人与订单状态的接口
const getData = async () => {
    //获取全部就诊人信息
    const result: AllUserResponseData = await reqAllUser()
    //获取全部订单状态
    const result1: AllOrderStateResponseData = await reqOrderState()
    allUser.value = result.data
    allOrderState.value = result1.data
}
//就诊人下拉菜单回调
const changeUser = ()=>{
    //根据就诊人id再次获取订单数据
    getOrderInfo()
}
//订单状态下拉菜单回调
const changeOrderState = ()=>{
    getOrderInfo()
}
</script>
<style scoped lang="scss"></style>