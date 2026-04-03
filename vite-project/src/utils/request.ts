//对于axios进行二次封装
//目的1:利用axios 请求与响应拦截器功能
//目的2:请求拦截器,一般可以在请求头中携带公共的参数:token
//目的3:响应拦截器,可以简化服务器返回的参数,处理http网络错误
import axios from "axios";
//引入用户相关仓库
import useUserStore from "@/store/modules/interface/user";
import { ElMessage } from "element-plus";
//利用axios.create方法创建一个axios实例:可以设置基础路径 超时的事件设置
const request = axios.create({
    baseURL:'/api',//请求基础路径的设置
    timeout:5000//超时时间设置
})

//请求拦截器
request.interceptors.request.use((config)=>{
    //获取用户仓库
    let userStore = useUserStore();
    //token:公共参数.如果用户登录了需要携带
    if(userStore.userInfo.token){
        config.headers.token = userStore.userInfo.token;
    }
    //config请求拦截器注入的对象（配置对象）,配置对象身上最重要的是headers属性
    //可以通过请求头携带公共参数token
    return config;
})
//响应拦截器
request.interceptors.response.use((response)=>{
//相应拦截器成功的回调,一般进行简化数组
return response.data;
},(error)=>{
//处理http网络错误
let status = error.response.status;
console.log(error)
switch(status){
    case 404:
        //错误提示信息
        ElMessage({
            type:'error',
            message:error.message
        })
        break;
}
return Promise.reject(new Error(error.message))
})

//务必对外暴露axios
export default request;