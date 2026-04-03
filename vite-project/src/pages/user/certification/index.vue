<template>
    <!--实名认证组件的结构-->
    <el-card class="box-card" style="max-width: 850px">
        <!--卡片头部-->
        <template #header>
            <div class="card-header">
                <span>实名信息</span>
            </div>
        </template>
        <!--实名认证结构提示部分-->
        <div class="tip" style="color: #7f7f7f;">
            <el-icon>
                <InfoFilled />
            </el-icon>
            <p>完成实名认证后才能添加就诊人，正常进行挂号，为了不影响后续步骤，建议提前实名认证。</p>
        </div>
        <!--卡片身体的底部:认证成功和未成功的结构-->
        <el-descriptions v-if="userInfo.authStatus == 1" class="margin-top" :column="1" border
            style="margin-top: 20px;">
            <el-descriptions-item label-align="center" width="50px">
                <template #label>
                    <div class="cell-item">
                        用户姓名
                    </div>
                </template>
                {{ userInfo.name }}
            </el-descriptions-item>
            <el-descriptions-item label-align="center" width="50px">
                <template #label>
                    <div class="cell-item">
                        证件类型
                    </div>
                </template>
                {{ userInfo.certificatesType == '10' ? '身份证' : '户口本' }}
            </el-descriptions-item>
            <el-descriptions-item label-align="center" width="50px">
                <template #label>
                    <div class="cell-item">
                        证件号码
                    </div>
                </template>
                {{ userInfo.certificatesNo }}
            </el-descriptions-item>
        </el-descriptions>
        <!--用户未验证的结构-->
        <el-form ref="form" :model="params" :rules="rules" v-if="userInfo.authStatus == 0" style="width: 60%;margin: 20px auto;" label-width="80">
            <el-form-item label="用户姓名" prop="name">
                <el-input placeholder="请输入用户姓名" v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="证件类型" prop="certificatesType">
                <el-select placeholder="请选择证件类型" v-model="params.certificatesType">
                    <el-option :label="item.name" :value="item.value" v-for="(item, index) in arrType"
                        :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="证件号码" prop="certificatesNo">
                <el-input placeholder="请输入证件号码" v-model="params.certificatesNo"></el-input>
            </el-form-item>
            <el-form-item label="上传证件" prop="certificatesUrl">
                <el-upload ref="upload" list-type="picture-card" :on-remove="handleRemove"
                    :on-preview="handlePictureCardPreview" :on-success="successhandler" :on-exceed="exceedhandler"
                    :limit="1" action="/api/oss/file/fileUpload?fileHost=userAuah">
                    <img style="width: 100%;height: 100%;" src="../../../assets/images/auth_example.png" alt="">
                </el-upload>
                <el-dialog v-model="dialogVisible">
                    <img w-full v-if="params.certificatesUrl" style="width: 100%;height: 100%;"
                        :src="params.certificatesUrl" alt="Preview Image" />
                </el-dialog>
            </el-form-item>
            <el-form-item>
                <el-button style="width: 60px;" type="primary" @click="submit">提交</el-button>
                <el-button style="width: 60px;" type="primary" @click="reset">重写</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup lang="ts">
import { InfoFilled, Plus } from '@element-plus/icons-vue'
//获取用户信息
import { reqUserInfo, reqCertationType, reqUserCertation } from '@/api/user';
import { UserInfoResponseData, CertationTypeRespnseData, CertationArr, UserParams } from '@/api/user/type';
//引入组合式API函数
import { onMounted, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
//获取from组件
let form = ref()
let upload = ref()
//存储用户信息
let userInfo: any = ref<any>({});
let arrType = ref<CertationArr>([])
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//收集用户表单认证的数据
let params = reactive<UserParams>({
    "certificatesNo": '',
    "certificatesType": '',
    "certificatesUrl": '',
    "name": ''
})
//组件挂载完毕
onMounted(() => {
    //获取用户信息方法
    getUserInfo();
    //获取证件类型的接口
    getType();
})
//获取用户信息方法
const getUserInfo = async () => {
    let result: UserInfoResponseData = await reqUserInfo()
    if (result.code == 200) {
        userInfo.value = result.data
    }
}
//获取证件类型的数据
const getType = async () => {
    let result: CertationTypeRespnseData = await reqCertationType();
    if (result.code == 200) {
        arrType.value = result.data
        console.log(arrType.value)
    }
}
//超出图片数量的钩子
const exceedhandler = () => {
    ElMessage({
        type: 'error',
        message: '图片仅能上传一张'
    })
}
//图片上传成功的钩子
const successhandler = (response: any, uploadFile: any, uploadFiles: any) => {
    //清除校验结果
    form.value.clearValidate('certificatesUrl')
    //收集上传成功的图片地址
    params.certificatesUrl = response.data
}
//照片墙预览的钩子
const handlePictureCardPreview = (uploadFile: any) => {
    //触发预览的钩子时,对话框显示
    dialogVisible.value = true
}
//照片墙删除图片的钩子
const handleRemove = () => {
    params.certificatesUrl = ''
}
//重写按钮的回调
const reset = () => {
    //清除文件上传列表
    upload.value.clearFiles()
    //清空数据
    Object.assign(params, {
        "certificatesNo": '',
        "certificatesType": '',
        "certificatesUrl": '',
        "name": ''
    })
}

//提交按钮的回调
const submit = async () => {
    //全部的表单校验返回一个成功的Promise
    //如果有一个失败返回一个失败的Promise,后面的语句不再执行
    await form.value.validate();
    try {
        //认证成功
        await reqUserCertation(params)
        ElMessage({
            type:'success',
            message:'认证成功'
        })
        //认证成功后再次获取用户信息
        getUserInfo()
    } catch (error) {
        //认证失败
        ElMessage({
            type:'error',
            message:'认证失败'
        })
    }
}

//自定义校验规则姓名方法
const validatorName = (rule:any,value:any,callBack:any)=>{
//rule为当前校验字段的校验规则对象
const reg = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/
if(reg.test(value)){
    callBack();
}else{
    callBack(new Error('请输入正确的姓名'))
}
}
//证件类型校验的方法
const validatorType = (rule:any,value:any,callBack:any)=>{
if(value=='10'||value=='20'){
    callBack()
}else{
    callBack(new Error('请选择证件类型'))
}
}
//证件号码的校验方法
const validatorNo = (rule:any,value:any,callBack:any)=>{
    let sfz = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    let hkb = /\d{9}/;
    if(sfz.test(value)||hkb.test(value)){
        callBack();
    }else{
        callBack(new Error('请输入正确的身份证或户口本号码'))
    }
}
//证件照片的
const validatorUrl = (rule:any,value:any,callBack:any)=>{
    if(value.length){
        callBack();
    }else{
        callBack(new Error('请上传证件照片'))
    }
}
//表单校验规则对象
const rules = {
    //用户姓名校验规则
    name:[{
        required:true,
        validator:validatorName
    }],
    certificatesType:[{
        required:true,
        validator:validatorType
    }],
    certificatesNo:[{
        required:true,
        validator:validatorNo
    }],
    certificatesUrl:[{
        required:true,
        validator:validatorUrl
    }]
}
</script>
<style scoped lang="scss">
.box-card {
    .tip {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>