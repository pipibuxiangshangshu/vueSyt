<template>
    <div class="level">
        <h3>医院</h3>
        <div class="content">
            <div class="left">等级:</div>
            <ul class="hospital">
                <li :class="{ active: activeFlag == '' }" @click="changeLevel('')">全部</li>
                <li v-for="level in levelArr" :class="{ active: activeFlag == level.value }" :key="level.value"
                    @click="changeLevel(level.value)">{{ level.name }}</li>
            </ul>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reqHospitalLevelAndRegion } from "@/api/home/index";
import { onMounted, ref } from "vue";
import type { HospitalLevelAndRegionResponseData, HospitalLevelAndRegionArr } from "@/api/home/type";
//定义一个数组存储医院等级数据
let levelArr = ref<HospitalLevelAndRegionArr>([]);
//控制医院等级高亮响应式数据
let activeFlag = ref<string>('');
//组件挂载完毕
onMounted(() => {
    getLevel()
})
//获取医院等级的数据
const getLevel = async () => {
    let result: HospitalLevelAndRegionResponseData = await reqHospitalLevelAndRegion('HosType');
    //存储医院等级数据
    if (result.code === 200) {
        levelArr.value = result.data;
    }
}

//点击等级按钮的回调
const changeLevel = (level: string) => {
    //高亮的响应式数据存储level数组
    activeFlag.value = level;
    //触发自定义事件:将医院等级参数传给父组件
    $emit('getLevel',level);
}
let $emit = defineEmits(['getLevel'])
</script>
<style scoped lang="scss">
.level {
    color: #7f7f7f;

    h3 {
        font-weight: 900;
        margin: 10px 0px
    }

    .content {
        display: flex;

        .left {
            margin-right: 10px;
        }

        .hospital {
            display: flex;

            li {
                margin-right: 10px;

                &.active {
                    color: #55a6ef;
                }
            }

            li:hover {
                color: #55a6ef;
                cursor: pointer;
            }
        }
    }

}
</style>