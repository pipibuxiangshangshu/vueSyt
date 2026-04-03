//定义用户相关的仓库
import { defineStore } from "pinia";
//引入获取验证码的请求方法
import { reqCode, reqUserLogin } from "@/api/hospital";
import type { LoginData, UserLoginResponseData } from "@/api/hospital/type";
import { UserState } from "./";
import { clear } from "console";
const useUserStore = defineStore('User', {
    state: (): UserState => {
        return {
            visiable: false,//用于控制登录组件dialog显示与隐藏
            code: '',//存储验证码
            userInfo: JSON.parse(localStorage.getItem('USERINFO') as string) || {}
        }
    },
    actions: {
        //获取验证码的方法
        async getCode(phone: string) {
            //携带手机号发送请求,获取验证码
            let result: any = await reqCode(phone);
            if (result.code == 200) {
                this.code = result.data
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        //用户手机号码登录的方法
        async userLogin(LoginData: LoginData) {
            //登录请求
            let result: UserLoginResponseData = await reqUserLogin(LoginData);
            if (result.code == 200) {
                this.userInfo = result.data
                //本地持久化存储用户信息
                console.log(this)
                localStorage.setItem('USERINFO', JSON.stringify(this.userInfo));
                //返回成功的Promise
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message));
            }
        },
        //用户退出登录的方法
        logout() {
            this.userInfo = { name: '', token: '' };
            //清除本地存储用户相关的数据
            localStorage.removeItem('USERINFO');
        },
        //查询微信扫码的接口(查看本地是否存储了数据)
        queryState() {
            //开启定时器每隔一段时间：本地存储是否拥有用户信息
            let timer = setInterval(() => {
                //本地存储拥有数据:扫码成功
                if (localStorage.getItem('USERINFO')) {
                    //关闭对话框
                    this.visiable = false;
                    this.userInfo = JSON.parse(localStorage.getItem('USERINFO')as string);
                    clearInterval(timer);
                }
            }, 1000)
        }
    },
    getters: {

    }
});
export default useUserStore;