<template>
    <div class="wrap">
        <!--顶部结构-->
        <div class="top">
            <div class="hosname">{{ workData.baseMap?.hosname }}</div>
            <div class="line"></div>
            <div>{{ workData.baseMap?.bigname }}</div>
            <div class="dot">.</div>
            <div class="hosdepartment">{{ workData.baseMap?.depname }}</div>
        </div>
        <!--中间展示日期结构-->
        <div class="center">
            <h4>{{ workData.baseMap?.workDateString }}</h4>
            <div class="container">
                <div class="item" @click="changeTime(item)"
                    :class="{ active: item.status == -1 || item.availableNumber == -1, cur: item.workDate == workTime.workDate }"
                    v-for="(item, index) in workData.bookingScheduleList" :key="index">
                    <div class="top1">{{ item.workDate }}{{ item.dayOfWeek }}</div>
                    <div class="bottom">
                        <div v-if="item.status == -1">停止挂号</div>
                        <div v-if="item.status == 0">
                            {{ item.availableNumber == -1 ? '约满了' : `有号(${item.availableNumber})` }}
                        </div>
                        <div v-if="item.status == 1">
                            即将放号
                        </div>
                    </div>
                </div>
            </div>
            <el-pagination v-model:current-page="pageNo" layout="prev, pager, next" :total="workData.total"
                @current-change="fetchWorkData" />
        </div>
        <!--底部展示医生结构-->
        <div class="bottomDoc">
            <!--展示即将放号的时间-->
            <div class="will" v-if="workTime.status == 1">
                <span>xxxx年x月xx日</span>
                <span>放号</span>
            </div>
            <!--展示医生的结构:上午、下午-->
            <div class="doctor" v-else>
                <!--上午-->
                <div class="morning">
                    <!--顶部文字提示-->
                    <div class="tip">
                        <svg t="1719215313277" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="4267" width="32" height="32">
                            <path
                                d="M470.683 164.308h78.115v113.254h-78.115zM767.581 383.086l74.219-66.442-58.6-58.6-70.334 70.333zM236.271 258.038l70.335 70.334-58.6 58.6-70.334-70.335zM822.286 492.272h117.205v78.115H822.286zM509.745 388.343c-142.755 0-259.583 116.615-260.045 259.209h520.08c-0.461-142.594-117.28-259.209-260.035-259.209zM79.995 491.241h117.201v78.115H79.995zM769.781 647.552c0.001 0.281 0.011 0.561 0.011 0.842H249.69c0-0.282 0.01-0.561 0.011-0.842H8.772V690.2h1003.532v-42.648H769.781zM214.163 817.515h592.719v42.648H214.163z"
                                p-id="4268" fill="#1296db"></path>
                        </svg>
                        <span>上午号源</span>
                    </div>
                    <!--每个医生的信息-->
                    <div class="docinfo" v-for="doctor in morningArr" :key="doctor.id">
                        <!--左侧医生名字和技能-->
                        <div class="left">
                            <div class="info">
                                <span>{{ doctor.title }}</span>
                                <span>|</span>
                                <span>{{ doctor.docname }}</span>
                            </div>
                            <div class="skill">{{ doctor.skill }}</div>
                        </div>
                        <!--右侧挂号金额和剩余数-->
                        <div class="right">
                            <div class="money">￥{{ doctor.amount }}</div>
                            <el-button @click="goStep2(doctor)" type="primary" size="default" bg="true" style="width: 100px;">剩余:{{
                                doctor.availableNumber }}</el-button>
                        </div>
                    </div>
                </div>
                <!--下午-->
                <div class="morning">
                    <!--顶部文字提示-->
                    <div class="tip">
                        <svg t="1719218426168" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="6246" width="32" height="32">
                            <path
                                d="M166.4 712.533333c-17.066667-17.066667-17.066667-42.666667 0-59.733333l59.733333-59.733333c17.066667-17.066667 42.666667-17.066667 59.733334 0 17.066667 17.066667 17.066667 42.666667 0 59.733333l-59.733334 59.733333c-17.066667 17.066667-42.666667 17.066667-59.733333 0z m691.2 0c-17.066667 17.066667-42.666667 17.066667-59.733333 0l-59.733334-59.733333c-17.066667-17.066667-17.066667-42.666667 0-59.733333 17.066667-17.066667 42.666667-17.066667 59.733334 0l59.733333 59.733333c17.066667 17.066667 17.066667 42.666667 0 59.733333zM512 896c-25.6 0-42.666667-17.066667-42.666667-42.666667v-85.333333c0-25.6 17.066667-42.666667 42.666667-42.666667s42.666667 17.066667 42.666667 42.666667v85.333333c0 25.6-17.066667 42.666667-42.666667 42.666667z m128-640H384c-25.6 0-42.666667-17.066667-42.666667-42.666667s17.066667-42.666667 42.666667-42.666666h256c25.6 0 42.666667 17.066667 42.666667 42.666666s-17.066667 42.666667-42.666667 42.666667z m42.666667 170.666667H341.333333c0 93.866667 76.8 170.666667 170.666667 170.666666s170.666667-76.8 170.666667-170.666666z m85.333333 0c0 140.8-115.2 256-256 256s-256-115.2-256-256H128c-25.6 0-42.666667-17.066667-42.666667-42.666667s17.066667-42.666667 42.666667-42.666667h768c25.6 0 42.666667 17.066667 42.666667 42.666667s-17.066667 42.666667-42.666667 42.666667h-128z"
                                p-id="6247" fill="#1296db"></path>
                        </svg>
                        <span>下午号源</span>
                    </div>
                    <!--每个医生的信息-->
                    <div class="docinfo" v-for="doctor in afterArr" :key="doctor.id">
                        <!--左侧医生名字和技能-->
                        <div class="left">
                            <div class="info">
                                <span>{{ doctor.title }}</span>
                                <span>|</span>
                                <span>{{ doctor.docname }}</span>
                            </div>
                            <div class="skill">{{ doctor.skill }}</div>
                        </div>
                        <!--右侧挂号金额和剩余数-->
                        <div class="right">
                            <div class="money">￥{{ doctor.amount }}</div>
                            <el-button @click="goStep2(doctor)" type="primary" size="default" bg="true" style="width: 100px;">剩余:{{
                                doctor.availableNumber }}</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { reqHospitalWork, reqHospitalDoctor } from '@/api/hospital';
import { useRoute,useRouter } from 'vue-router';
import type { HospitalWordData, DoctorResponseData, DocArr, Doctor } from '@/api/hospital/type';
//获取路由对象
let $route = useRoute();
//获取路由器对象
let $router = useRouter();
//分页器当前页码
let pageNo = ref<number>(1);
//每页展示几条数据
let limit = ref<number>(6);
//存储医院科室挂号的数据
let workData = ref<any>({});
//存储排班日期:当前数据的第一个
let workTime: any = ref({});
//存储排班医生的数据
let docArr = ref<DocArr>([]);
//组件挂载完毕发送请求
onMounted(() => {
    fetchWorkData();
})
//获取挂号数据
const fetchWorkData = async () => {
    let result: HospitalWordData = await reqHospitalWork(pageNo.value, limit.value, $route.query.hoscode as string, $route.query.depcode as string);
    if (result.code == 200) {
        workData.value = result.data;
        //存储第一天日期的数据
        workTime.value = workData.value.bookingScheduleList[0]
        //获取一次医生的数据
        getDoctorWorkData();
    }
}
//获取医生某一天排班的数据
const getDoctorWorkData = async () => {
    //医院的编号
    let hoscode: string = $route.query.hoscode as string;
    //科室的编号
    let depcode: string = $route.query.depcode as string;
    //工作时间
    let workDate: string = workTime.value.workDate;
    //获取排版医生的数据
    let result: DoctorResponseData = await reqHospitalDoctor(hoscode, depcode, workDate);
    if (result.code == 200) {
        docArr.value = result.data;
    }
}
//点击顶部某一天的时候触发回调
const changeTime = (item: any) => {
    //存储用户选择的那一天的数据
    workTime.value = item;
    //在发送一次请求获取医生排班的数据
    getDoctorWorkData();
}
//计算出上午排班的医生数据
let morningArr = computed(() => {
    return docArr.value.filter((doc: Doctor) => {
        return doc.workTime == 0;
    })
})
//计算出下午排班的医生数据
let afterArr = computed(() => {
    return docArr.value.filter((doc: Doctor) => {
        return doc.workTime == 1;
    })
})
//路由跳转进入选择就诊人页面
const goStep2 = (doctor:Doctor)=>{
//编程时导航进行路由跳转且携带医生的id
$router.push({path:'/hospital/register_step2',query:{docId:doctor.id}});
}
</script>
<style scoped lang="scss">
.wrap {
    .top {
        display: flex;
        color: #7f7f7f;

        .line {
            width: 2px;
            height: 19px;
            background: skyblue;
            margin: 0px 5px;
        }

        .dot {
            margin: 0px 5px;
            color: skyblue
        }
    }

    .center {
        margin: 20px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;

        h4 {
            font-weight: 900;
        }

        .container {
            margin: 50px 0px;
            width: 100%;
            display: flex;

            .item {
                flex: 1;
                width: 100%;
                border: 1px solid skyblue;
                margin: 0px 5px;
                transition: all 0.3s;

                &.active {
                    border: 1px solid #ccc;
                    color: #7f7f7f;

                    .top1 {
                        background: #ccc;
                    }
                }

                &.cur {
                    transform: scale(1.1);
                }

                .top1 {
                    background-color: #e8f2ff;
                    height: 30px;
                    width: 100%;
                    text-align: center;
                    line-height: 30px;
                }

                .bottom {
                    width: 100%;
                    height: 60px;
                    text-align: center;
                    line-height: 60px;
                }
            }

            .item:hover {
                cursor: pointer;
            }
        }
    }

    .bottomDoc {
        .will {
            text-align: center;
            font-size: 30px;
            font-weight: 900;
        }

        .doctor {
            .morning {
                .tip {
                    display: flex;
                    align-items: center;

                    span {
                        color: #7f7f7f;
                        font-weight: 900;
                    }
                }

                .docinfo {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0px;
                    border-bottom: 1px solid #ccc;

                    .left {
                        .info {
                            color: skyblue;
                            margin: 10px 0px;

                            span {
                                margin: 0px 5px;
                                font-size: 18px;
                                font-weight: 900;
                            }
                        }

                        .skill {
                            margin: 10px 0px;
                            color: #7f7f7f;
                        }
                    }

                    .right {
                        width: 150px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .money {
                            color: #7f7f7f;
                            font-weight: 900;
                        }
                    }

                }
            }
        }
    }

}
</style>