<template>
    <div class="login_container">
        <!--title:对话框左上角标题,v-model控制显示与隐藏-->
        <el-dialog v-model="userStore.visiable" title="用户登录" width="800" @close="close">
            <!--对话框身体部分的结构-->
            <el-row>
                <!--左侧结构:手机号码登陆,微信扫一扫登录-->
                <el-col :span="12">
                    <div class="login">
                        <div v-show="scene == 0">
                            <el-form :model="loginParam" :rules="rules" ref="form">
                                <el-form-item prop="phone">
                                    <el-input placeholder="请输入手机号码" :prefix-icon="User"
                                        v-model="loginParam.phone"></el-input>
                                </el-form-item>
                                <el-form-item prop="code">
                                    <el-input placeholder="请输入手机验证码" :prefix-icon="Lock"
                                        v-model="loginParam.code"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button style="width: 100px;" :disabled="!isPhone || flag ? true : false">
                                        <CountDown v-if="flag" :flag="flag" @getFlag="getFlag" />
                                        <span v-else @click="getCode">获取验证码</span>
                                    </el-button>
                                </el-form-item>
                            </el-form>
                            <el-button style="width: 100%;" type="primary" size="defult"
                                :disabled="!isPhone || loginParam.code.length < 6 ? true : false"
                                @click="login">用户登录</el-button>
                            <div class="bottom" @click="changeScene">
                                <p>微信扫码登陆</p>
                                <svg t="1719058484638" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="5407" width="32" height="32">
                                    <path
                                        d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z"
                                        fill="#1afa29" p-id="5408"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="webchat" v-show="scene == 1">
                            <!--在这个容器显示微信扫码登陆二维码-->
                            <div id="login_container"></div>
                            <div class="phone" @click="handler">
                                <p>手机短信验证码登录</p>
                                <svg t="1719141220370" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="5586" width="16" height="16">
                                    <path
                                        d="M345.165 905.107c-82.709 0-149.999-67.29-149.999-150v-490c0-82.71 67.289-150 149.999-150h349.998c82.71 0 150 67.29 150 150v490c0 82.71-67.29 150-150 150H345.165z"
                                        fill="#FFFFFF" p-id="5587"></path>
                                    <path
                                        d="M695.163 140.107c33.39 0 64.78 13.002 88.389 36.612 23.609 23.609 36.611 54.999 36.611 88.388v490c0 33.389-13.002 64.779-36.611 88.388-23.609 23.609-55 36.612-88.389 36.612H345.165c-33.389 0-64.779-13.002-88.388-36.612-23.609-23.609-36.611-55-36.611-88.388v-490c0-33.389 13.002-64.779 36.611-88.388s54.999-36.612 88.387-36.612h349.999m0-50H345.165c-96.651 0-174.998 78.351-174.998 175v490c0 96.649 78.348 175 174.998 175h349.998c96.653 0 175-78.351 175-175v-490c0-96.648-78.347-175-175-175z"
                                        fill="#1A1A1A" p-id="5588"></path>
                                    <path
                                        d="M677.664 228.212H362.666c-28.994 0-52.5 23.504-52.5 52.498v297.502c0 28.992 23.506 52.498 52.5 52.498h314.998c28.996 0 52.5-23.506 52.5-52.498V280.71c0-28.994-23.504-52.498-52.5-52.498zM520.166 683.21c-38.659 0-70 31.339-70 70 0 38.659 31.341 70.002 70 70.002 38.658 0 70-31.342 70-70.002 0-38.661-31.343-70-70-70z"
                                        fill="#FFCD36" p-id="5589"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </el-col>
                <!--右侧结构-->
                <el-col :span="12">
                    <div class="leftContent">
                        <div class="top">
                            <div class="item">
                                <img src="../../assets/images/code_app.png" alt="">
                                <svg t="1719058484638" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="5407" width="32" height="32">
                                    <path
                                        d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z"
                                        fill="#cdcdcd" p-id="5408"></path>
                                </svg>
                                <p>微信扫一扫关注</p>
                                <p>“快速预约挂号”</p>
                            </div>
                            <div class="item">
                                <img src="../../assets/images/code_login_wechat.png" alt="">
                                <svg t="1719058839475" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="6734" width="32" height="32">
                                    <path
                                        d="M820.409449 797.228346q0 25.19685-10.07874 46.866142t-27.716535 38.299213-41.322835 26.204724-50.897638 9.574803l-357.795276 0q-27.212598 0-50.897638-9.574803t-41.322835-26.204724-27.716535-38.299213-10.07874-46.866142l0-675.275591q0-25.19685 10.07874-47.370079t27.716535-38.80315 41.322835-26.204724 50.897638-9.574803l357.795276 0q27.212598 0 50.897638 9.574803t41.322835 26.204724 27.716535 38.80315 10.07874 47.370079l0 675.275591zM738.771654 170.330709l-455.559055 0 0 577.511811 455.559055 0 0-577.511811zM510.992126 776.062992q-21.165354 0-36.787402 15.11811t-15.622047 37.291339q0 21.165354 15.622047 36.787402t36.787402 15.622047q22.173228 0 37.291339-15.622047t15.11811-36.787402q0-22.173228-15.11811-37.291339t-37.291339-15.11811zM591.622047 84.661417q0-8.062992-5.03937-12.598425t-11.086614-4.535433l-128 0q-5.03937 0-10.582677 4.535433t-5.543307 12.598425 5.03937 12.598425 11.086614 4.535433l128 0q6.047244 0 11.086614-4.535433t5.03937-12.598425z"
                                        p-id="6735"></path>
                                </svg>
                                <p>扫一扫下载</p>
                                <p>“预约挂号”App</p>
                            </div>
                        </div>
                    </div>
                    <p class="tip">尚医通官方制定平台</p>
                    <p class="tip">快速挂号 安全放心</p>
                </el-col>
            </el-row>

            <template #footer>
                <el-button type="primart" size="default" style="width: 160px;height: 40px;"
                    @click="closeDialog">关闭窗口</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
//引入微信扫码登陆参数请求
import { reqWxlogin } from '@/api/hospital';
//引入倒计时组件
import CountDown from '@/components/countdown/index.vue'
import { ref, reactive, computed,watch } from 'vue';
import { User, Lock, Phone } from '@element-plus/icons-vue'
import type { WXLoginResponseData } from '@/api/hospital/type';
//获取user仓库的数据(visiable)控制login组件会话框的显示与隐藏
import useUserStore from '@/store/modules/interface/user'
import { ElMessage } from 'element-plus';
let userStore = useUserStore();
//定义一个响应式数据,控制倒计时组件的显示与隐藏
let flag = ref<boolean>(false);//flag为真,开启倒计时; flag为假,不是倒计时
let scene = ref<number>(0);//0代表手机号码登录 1代表微信扫码登录
//获取form组件实例
let form = ref<any>()
//收集表单数据--手机号码
let loginParam = reactive({
    phone: '',//搜集手机号码
    code: '',//搜集验证码
});
//计算出当前表单元素搜集内容是否为手机号
let isPhone = computed(() => {
    //手机号码的正则表达式
    const reg = /^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/;
    //返回布尔值: 真代表手机号码，假代表不是手机号码
    return reg.test(loginParam.phone)
})
//点击微信扫码登陆或小图标切换为扫码登陆
const changeScene = async () => {
    scene.value = 1;
    //发送请求获取微信扫码二维码需要的参数
    //向硅谷学校的服务器发请求，获取微信扫码登录页面参数
    //需要携带参数：告诉学校服务器用户授权成功以后重定向到项目的某个页面
    let redirect_uri = encodeURIComponent(window.location.origin + '/wxlogin')
    let result: WXLoginResponseData = await reqWxlogin(redirect_uri);
    //生成微信扫码登录的二维码页面
    //@ts-ignore
    new WxLogin({
        self_redirect: true,//true:手机点击确认登录后可以在 iframe 内跳转到 redirect_uri
        id: "login_container",//显示二维码的容器
        appid: result.data.appid,
        scope: "snsapi_login",
        redirect_uri: result.data.redirectUri,//
        state: result.data.state,
        style: "black",
        href: ""
    });
}
//获取验证码按钮的回调
const getCode = async () => {
    //解决element-plus禁用还能点击的问题
    if (!isPhone.value || flag.value) return;
    //开启倒计时模式,显示倒计时组件
    flag.value = true;
    //通知pinia仓库存储验证码
    try {

        //获取验证码成功
        await userStore.getCode(loginParam.phone)
        loginParam.code = userStore.code;
    } catch (error) {
        //获取验证码失败
        ElMessage({
            type: 'error',
            message: (error as Error).message
        })
    }
}
//计时器子组件绑定的自定义事件
//倒计时为零的时候,通知父组件倒计时组件隐藏
const getFlag = (val: boolean) => {
    //倒计时模式结束
    flag.value = val;
}

//点击登录按钮回调
const login = async () => {
    //保证表单校验两项都符合条件
    await form.value.validate();
    //发起登录请求
    //请求成功:顶部组件展示用户名字、对话框关闭
    //登陆失败：弹出对应登陆失败的错误信息
    try {
        //用户登录成功
        await userStore.userLogin(loginParam)
        //关闭对话框
        userStore.visiable = false;
    } catch (error) {
        ElMessage({
            type: 'error',
            message: (error as Error).message
        })
    }
}

//自定义校验规则:手机号码自定义校验规则
const validatorPhone = (rule: any, value: any, callback: any) => {
    //rule为表单校验的规则对象
    //value为当前文本内容
    //callback为回调函数
    const reg = /^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/;
    if (reg.test(value)) {
        callback();
    } else {
        callback(new Error('请输入正确的手机号格式'))
    }
}
//自定义校验规则:验证码自定义校验规则
const validatorCode = (rule: any, value: any, callback: any) => {
    //rule为表单校验的规则对象
    //value为当前文本内容
    //callback为回调函数

    if (/^\d{6}$/.test(value)) {
        callback();
    } else {
        callback(new Error('请输入正确的验证码格式'))
    }
}

//表单校验规则对象
const rules = {
    //手机号码的校验规则
    //required代表当前字段必须校验
    //message代表校验错误提示信息
    //trigger代表表单校验触发时机 change文本发生变化时校验 blur失去焦点触发校验
    // phone: [{ required: true, message: "手机号码格式错误", trigger: "change", min: 11 }],
    // code:[{ required: true, message: "验证码必须是六位", trigger: "blur", min: 6 }]
    phone: [{ trigger: "change", validator: validatorPhone }],
    code: [{ trigger: "change", validator: validatorCode }]
}

//对话框关闭回调
const close = () => {
    //清空收集的数据
    Object.assign(loginParam, { phone: '', code: '' });
    //清除上一次校验的结果
    form.value.resetFields();
}

//关闭窗口按钮回调
const closeDialog = () => {
    //关闭对话窗框
    userStore.visiable = false;
    //调用close回调清空数据
    close();
}

//点击手机短信验证码盒子的回调
const handler=()=>{
    scene.value = 0;
}

//监听场景数据
watch(()=>scene.value,(val:number)=>{
    if(val==1){
        userStore.queryState();
    }
})
</script>
<style scoped lang="scss">
.login_container {
    ::v-deep(.el-dialog__body) {
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
    }

    .login {
        padding: 20px;
        border: 1px solid #ccc;

        .bottom {
            display: flex;
            flex-direction: column;
            align-items: center;

            p {
                margin: 10px 0px;
            }
        }
        .bottom:hover{
                cursor: pointer;
            }

        .webchat {
            display: flex;
            flex-direction: column;
            align-items: center;

            .phone {
                display: flex;
                flex-direction: column;
                align-items: center;
                p{
                    margin: 10px 0px
                }
            }
            .phone:hover{
                cursor: pointer;
            }
        }
    }

    .leftContent {
        .top {
            display: flex;
            justify-content: space-around;

            .item {
                display: flex;
                flex-direction: column;
                align-items: center;

                img {
                    width: 130px;
                    height: 130px;
                }

                p {
                    margin: 5px 0px
                }
            }
        }

    }

    .tip {
        text-align: center;
        margin: 20px 0px;
        font-size: 20px;
        font-weight: 900;
    }
}
</style>