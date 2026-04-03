<template>
    <!--就诊人组件静态-->
    <el-card style="max-width: 100%">
        <template #header>
            <div class="card-header">
                <span>就诊人管理</span>
                <el-button style="background-color: #409EFF;" type="primary" :icon="User"
                    @click="addUser">添加就诊人</el-button>
            </div>
        </template>
        <!--就诊人管理模块展示就诊人信息的结构-->
        <div class="visitor" v-if="scene == 0">
            <Visitor @changeScene="changeScene" class="item" v-for="(user, index) in userArr" :key="user.id"
                :user="user" :index="index" />
        </div>
        <!--添加或修改已有的就诊人信息的结构-->
        <div class="form" v-if="scene == 1">
            <el-divider content-position="left">就诊人信息</el-divider>
            <el-form style="width: 60%;margin:10px auto;">
                <el-form-item label="用户姓名">
                    <el-input placeholder="输入用户姓名"></el-input>
                </el-form-item>
                <el-form-item label="证件类型">
                    <el-select placeholder="请选择证件类型">
                        <el-option v-for="item in certationArr" :key="item.id" :label="item.name"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码">
                    <el-input placeholder="输入证件号码"></el-input>
                </el-form-item>
                <el-form-item label="用户性别">
                    <el-radio-group>
                        <el-radio value="1">男</el-radio>
                        <el-radio value="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="出生日期">
                    <el-date-picker type="datetime" placeholder="选择日期" />
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input placeholder="输入手机号码"></el-input>
                </el-form-item>
            </el-form>
            <el-divider content-position="left">建档信息</el-divider>
            <el-form style="width: 60%;margin:10px auto;">
                <el-form-item label="婚姻状况">
                    <el-radio-group>
                        <el-radio value="1">已婚</el-radio>
                        <el-radio value="0">未婚</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="自费/医保">
                    <el-radio-group>
                        <el-radio value="1">自费</el-radio>
                        <el-radio value="0">医保</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="当前住址">
                    <el-select clearable placeholder="请选择地址">
                        <el-cascader :props="props"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input placeholder="输入详细地址"></el-input>
                </el-form-item>
            </el-form>
            <el-divider content-position="left">联系人信息(选填)</el-divider>
            <el-form style="width: 60%;margin:10px auto;" label-width=80>
                <el-form-item label="用户姓名">
                    <el-input placeholder="输入用户姓名"></el-input>
                </el-form-item>
                <el-form-item label="证件类型">
                    <el-select placeholder="请选择证件类型">
                        <el-option v-for="item in certationArr" :key="item.id" :label="item.name"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码">
                    <el-input placeholder="输入证件号码"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input placeholder="输入手机号码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="background-color: #409EFF;width: 60px" type="primary">提交</el-button>
                    <el-button style="background-color: #409EFF;width: 60px" type="primary">重写</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>
<script setup lang="ts">
import type { CascaderProps } from 'element-plus'
import type { UserResponseData, UserArr } from '@/api/hospital/type';
import { reqGetUser } from '@/api/hospital';
import { reqCertationType,reqCity } from '@/api/user';
import type { CertationTypeRespnseData, CertationArr } from '@/api/user/type';
import { onMounted, ref } from 'vue';
import { User } from '@element-plus/icons-vue'
//存储证件类型的数据
let certationArr = ref<CertationArr>([])
//存储全部就诊人信息
let userArr = ref<UserArr>([])
//定义一个响应式数据：决定卡片的身体部分展示内容
let scene = ref<number>(1)
//组件挂在完毕获取一次就诊人信息
onMounted(() => {
    //获取就诊人信息
    getAllUser();
    //获取证件类型的数据
    getCertationType();
})
//获取全部就诊人信息
const getAllUser = async () => {
    let result: UserResponseData = await reqGetUser()
    if (result.code == 200) {
        userArr.value = result.data
    }
}
//添加就诊人按钮的回调
const addUser = () => {
    //切换场景为1
    scene.value = 1
}
//就诊人子组件自定义事件回调
const changeScene = () => {
    scene.value = 1
}
//获取证件类型的接口
const getCertationType = async () => {
    let result: CertationTypeRespnseData = await reqCertationType()
    if (result.code == 200) {
        certationArr.value = result.data
    }
}
//级联选择器
const props:CascaderProps = {
    lazy:true,//懒加载
    //加载级联选择器数据方法
    async lazyLoad(node, resolve) {
        let result:any = await reqCity("86")
        //整理数据
        let showData = result.data.map((item=>{
            return{
                label:item.name,
                value:item.value
            }   
        }))
        //注入组件所需要的数据
        resolve(showData)
  }
}
</script>
<style scoped lang="scss">
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.visitor {
    display: flex;
    flex-wrap: wrap;

    .item {
        width: 32%;
        margin: 5px;
    }
}
</style>