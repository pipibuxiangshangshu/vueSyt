<template>
    <div class="visitor">
        <div class="top">
            <div class="left">
                <span class="free">{{ user.inInsure==1?'医保':'自费' }}</span>
                <span class="username">{{user.name}}</span>
            </div>
            <div class="right">
                <el-button style="width: 40px;height: 40px;" circle type="primary" :icon="Edit" @click="$emit('changeScene')"></el-button>
                <el-button v-if="$route.path == '/user/patient'" style="width: 40px;height: 40px;" circle type="primary" :icon="Delete"></el-button>
            </div>
        </div>
        <div class="bottom">
            <p>证件类型:{{ user.param.certificatesTypeString }}</p>
            <p>证件号码:{{ user.certificatesNo }}</p>
            <p>性别:{{ user.sex==1?'女':'男' }}</p>
            <p>出生日期:{{ user.birthdate }}</p>
            <p>手机号:{{ user.phone }}</p>
            <p>婚姻状况:{{ user.isMarry==0?'未婚':'未婚'}}</p>
            <p>当前住址:{{ user.param.cityString }}</p>
            <p>详细地址:{{ user.param.fullAddress }}</p>
            <!--红色的已经选择的盒子-->
            <div class="confirm" v-if="index===currentIndex">已选择</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Edit,Delete } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
let $route = useRoute()
//接收父组件传递过来的就诊人信息
defineProps(['user','index','currentIndex'])
let $emit = defineEmits(['changeScene']);
</script>
<style scoped lang="scss">
.visitor {
    box-shadow: 0px 0px 12px rgb(0, 0, 0, 0.12);
    .top {
        width: 300px;
        height: 60px;
        background: #e5e5e5;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .left{
            .free{
                background: white;
                padding: 5px;
                font-size: 12px;
                margin-right: 15px;
                border-radius: 10px;
            }
            .username{
                color: #7f7f7f;
            }
        }
    }
    .bottom{
        padding-left: 48px;
        position: relative;
        p{
            line-height: 40px;
        }
        .confirm{
            position: absolute;
            width: 200px;
            height: 200px;
            color: red;
            border-radius: 50%;
            border: 1px dashed red;
            text-align: center;
            line-height: 200px;
            left: 20%;
            top:20%;
            opacity: 0.5;
            transform: rotate(35deg);
            font-weight: 900;
        }
    }
}
</style>