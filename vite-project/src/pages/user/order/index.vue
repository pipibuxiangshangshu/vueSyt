<template>
    <div>
        <div v-if="$route.query.orderId">
            <Detail />
        </div>
        <div v-else>
            <AllOrder />
        </div>
    </div>
</template>
<script setup lang="ts">
//引入子组件
import Detail from './datail/index.vue';
import AllOrder from './allOrder/index.vue';
import { useRoute } from 'vue-router';
//获取路由对象
let $route = useRoute();

</script>
<style scoped lang="scss"></style>