<template>
    <div class="region">
        <class class="content">
            <div class="left">地区:</div>
            <ul>
                <li :class="{ active: RegionFlag == '' }" @click="changeRegion('')">全部</li>
                <li v-for="item in RegionArr" :key="item.value" :class="{ active: RegionFlag == item.value }"
                    @click="changeRegion(item.value)">{{ item.name }}</li>
            </ul>
        </class>
    </div>
</template>
<script setup lang="ts">
import { reqHospitalLevelAndRegion } from "@/api/home/index";
import { onMounted, ref } from "vue";
import type { HospitalLevelAndRegionResponseData, HospitalLevelAndRegionArr } from "@/api/home/type";
//存储地区数据
let RegionArr = ref<HospitalLevelAndRegionArr>([]);
//地区高亮的响应式数据
let RegionFlag = ref<string>('')
//地区组件挂载完毕获取地区数据
onMounted(() => {
    getRegion()
});
//获取地区数据
const getRegion = async () => {
    let result: HospitalLevelAndRegionResponseData = await reqHospitalLevelAndRegion("Beijin")
    //存储全部地区的数据
    if (result.code == 200) {
        RegionArr.value = result.data;
    }
}
//点击不同区域的按钮回调
const changeRegion = (region: string) => {
    RegionFlag.value = region;
    $emit('getRegion',region)
}
let $emit = defineEmits(['getRegion'])
</script>
<style scoped lang="scss">
.region {
    color: #7f7f7f;
    margin-top: 10px;

    .content {
        display: flex;

        .left {
            margin-right: 5px;
            min-width: 40px;
        }

        ul {
            display: flex;
            flex-wrap: wrap;

            li {
                margin-right: 10px;
                margin-bottom: 10px;

                &.active {
                    color: #55a6fe;
                }
            }

            li:hover {
                color: #55a6fe;
                cursor: pointer;
            }
        }
    }
}
</style>