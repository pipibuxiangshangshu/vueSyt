import { defineStore } from "pinia";
import { reqHospitalDatail, reqHospitalDepartment } from '@/api/hospital/index'
import type { DetailState } from "./interface";
import type { HosPitalDetail, DepartmentResponse } from '@/api/hospital/type.ts'

//引入详情数据的ts类型
import type { HospitalDetail } from '@/api/hospital/type.ts'
//pinia仓库写法:组合式   选择式
const useDetailStore = defineStore('Detail', {
    state: (): DetailState => {
        return {
            //医院详情的数组
            hospitalInfo: ({} as HosPitalDetail),
            //存储医院科室的数据
            DepartmentInfo:[]
        }
    },
    actions: {
        //获取医院详情的方法
        async getHospital(hoscode: string) {
            let result: HospitalDetail = await reqHospitalDatail(hoscode)
            if (result.code == 200) {
                this.hospitalInfo = result.data;
            }
        },
        //获取医院科室数据
        async getDepartment(hoscode: string) {
            let result: DepartmentResponse = await reqHospitalDepartment(hoscode)
            if (result.code == 200) {
               this.DepartmentInfo = result.data
            }
        }
    },
    getters: {

    }
})
//暴露获取仓库的方法
export default useDetailStore;