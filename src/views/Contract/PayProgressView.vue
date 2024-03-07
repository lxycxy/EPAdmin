<script setup lang="ts">
import { reactive, ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SearchInput from '@/components/Input/SearchInput1.vue';
import type { ContractData, SearchConditions, PayRecord } from '@/api/contract';
import * as payRecordApi from "@/api/contract"
import Pagination from "@/components/Buttons/Pagination.vue"
import type { PaginationInfo } from "@/utils/Pagination";

let conditions: SearchConditions = reactive({}) as SearchConditions
const companyOp1 = ref([])
const companyOp2 = ref([])
const statusOp = [
  "审核中",
  "履行中",
  "已完成",
]
const contractOp = ref<ContractData[]>([])

const getContractData = () => {
  payRecordApi.getContractData()
      .then(resp => {
        contractOp.value = resp.data.contracts
      })
}
getContractData()

let pageInfo: PaginationInfo = reactive({}) as PaginationInfo
const handlePageChange = (currentPage: number) => {
  pageInfo.currentPage = currentPage;
  tableData.value = [...originData.value]
    .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

const tableData = ref<PayRecord[]>([])
const originData = ref<PayRecord[]>([])
let detailData : PayRecord = reactive({}) as PayRecord;
const getPayRecordData = () => {
  payRecordApi.getPayRecordData()
    .then(resp => {
      originData.value = resp.data

      pageInfo.totalCount = originData.value.length;
      pageInfo.pageSize = 6;
      pageInfo.totalPages = Math.ceil(pageInfo.totalCount / pageInfo.pageSize);
      pageInfo.currentPage = 1;
      tableData.value = [...originData.value]
        .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
    })
    .catch(resp => {
      console.log(resp)
    })
}
getPayRecordData();

const addDialogVisible = ref(false)
const addPayContractDialog = () => {
  addDialogVisible.value = true
}
const closeAddPayRecordDialog = () => {
  addDialogVisible.value = false;
  detailData = reactive({}) as PayRecord
}

const pageTitle = ref('合同支付进度')
</script>

<template>
  <DefaultLayout>
    <!-- 新增支付记录对话框 -->
    <el-dialog v-model="addDialogVisible" title="新增合同支付记录" width="800" align-center class="p-10"
      @close="closeAddPayRecordDialog()">
      <div class="rounded-lg px-6">
        <p>基本信息</p>

        <!-- 填报内容 -->
        <div class="grid grid-cols-12 mt-5">
          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">支付编号</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              v-model="detailData.payId" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">合同名称</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="detailData.contract" class="w-full text-xs" placeholder="" size="small">
              <el-option v-for="item in contractOp" :key="item.contractId" :label="item.contractName" :value="item.contractId" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">合同付款计划期</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              v-model="detailData.payPlan" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">未付金额(万元)</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="number"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.moneyNotpaid"
              />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">已付金额(万元)</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="number"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.moneyPaid"
              />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">付款日期</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="detailData.payDate" type="date" placeholder="" size="small" />
          </div>

          <div class="col-start-11 col-end-11">
            <button
              class="flex justify-around items-center bg-primary text-white rounded-lg w-14 p-1.5 text-xs ml-auto mt-5 mb-2 hover:bg-opacity-50">
              确定
            </button>
          </div>
          <div class="col-start-12 col-end-12">
            <button
              class="flex justify-around items-center bg-white text-black border rounded-lg w-14 p-1.5 text-xs ml-auto mt-5 mb-2 hover:bg-gray"
              @click="closeAddPayRecordDialog()">
              取消
            </button>
          </div>

        </div>
      </div>

    </el-dialog>

    <div class="mx-auto max-w-400">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->

      <!-- 搜索框 -->
      <div class="grid grid-cols-3 rounded-2xl bg-white dark:bg-boxdark ">
        <SearchInput class="col-span-1 text-xs max-w-1/3 justify-center" label="合同名称" placeholder="请输入"
          v-model="conditions.name">
        </SearchInput>
        <SearchInput class="col-span-1 text-xs max-w-1/3 justify-center" label="合同类别" placeholder="请输入"
          v-model="conditions.type">
        </SearchInput>
        <div class="col-span-1 text-xs max-w-1/3 items-center justify-center flex">
          <p class="justify-end mr-2">合同金额</p>
          <input type="number" placeholder="请输入"
            class="w-1/4 max-w-1/10 rounded-sm border-slate-300 border transition focus:ring-slate-300 focus:ring-2 bg-transparent py-2 pl-3 pr-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white" />
          <p class="mx-2">至</p>
          <input type="number" placeholder="请输入"
            class="w-1/4 max-w-1/10 rounded-sm border-slate-300 border transition focus:ring-slate-300 focus:ring-2 bg-transparent py-2 pl-3 pr-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white" />
        </div>

        <div class="col-span-1 flex justify-center items-center">
          <p class="text-xs ml-3">甲方单位</p>
          <el-select v-model="conditions.firstCompany" class="m-2 max-w-100" placeholder="" style="width: 250px">
            <el-option v-for="item in companyOp1" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="col-span-1 flex justify-center items-center">
          <p class="text-xs ml-3">乙方单位</p>
          <el-select v-model="conditions.secondCompany" class="m-2 max-w-100" placeholder="" style="width: 252.88px">
            <el-option v-for="item in companyOp2" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="col-span-1 flex justify-center items-center">
          <p class="text-xs ml-3">合同状态</p>
          <el-select v-model="conditions.status" class="m-2 max-w-100" placeholder="" style="width: 230px">
            <el-option v-for="item in statusOp" :key="item" :label="item" :value="item" />
          </el-select>
        </div>

        <div class="col-span-1 flex justify-center items-center">
          <p class="text-xs">合同签订日期</p>
          <el-date-picker v-model="conditions.signDate" type="daterange" range-separator="至" start-placeholder="开始时间"
            end-placeholder="结束时间" class="m-2 max-w-100" value-format="YYYY-MM-DD" style="width: 200px;" />
        </div>
        <div class="col-span-1 flex justify-center items-center">
          <p class="text-xs">应付款日期</p>
          <el-date-picker v-model="conditions.payPlan" type="daterange" range-separator="至" start-placeholder="开始时间"
            end-placeholder="结束时间" class="m-2 max-w-100" value-format="YYYY-MM-DD" style="width: 200px" />
        </div>
        <div class="col-span-1 flex justify-center items-center">
          <p class="text-xs">实际付款日期</p>
          <el-date-picker v-model="conditions.payDate" type="daterange" range-separator="至" start-placeholder="开始时间"
            end-placeholder="结束时间" class="m-2 max-w-100" value-format="YYYY-MM-DD" style="width: 200px" />
        </div>

        <div class="col-start-3 flex justify-end">
          <button
            class="flex justify-around items-center bg-primary text-white rounded-lg w-15 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
              <path fill="#ffffff"
                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
            查询
          </button>

          <button
            class="flex justify-around justify-end items-center bg-meta-3 text-white rounded-lg w-15 p-1.5 text-xs m-2 hover:ring-1 hover:ring-meta-3 hover:-translate-y-1 transition ring-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20" width="20">
              <path fill="#ffffff"
                d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z" />
            </svg>
            重置
          </button>
        </div>
      </div>

      <!-- 操作区 -->
      <div class="flex items-center flex-wrap mt-2">
        <button @click="addPayContractDialog()"
          class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 448 512">
            <path fill="#ffffff"
              d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>
          新增
        </button>

        <button
          class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-white">
            <path d="M11 16h2V7h3l-4-5-4 5h3z">
            </path>
            <path
              d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z">
            </path>
          </svg>
          导出
        </button>
      </div>

      <div class="max-h-400 overflow-y-auto">
        <!-- 表格 -->
        <table class="w-full table-wrapper rounded-lg">
          <!-- 表头 -->
          <thead>
            <tr class="bg-slate-300 text-center dark:bg-meta-4">
              <th class="text-xs min-w-[50px] py-1 px-2 font-medium text-black dark:text-white">
                序号
              </th>
              <th class="text-xs min-w-[130px] py-1 px-2 font-medium text-black dark:text-white">
                合同编号
              </th>
              <th class="text-xs font-normal min-w-[130px] py-1 px-2 font-medium text-black dark:text-white">
                合同名称
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                签订日期
              </th>
              <th class="text-xs min-w-[100px] py-2 px-2 font-medium text-black dark:text-white">
                结束日期
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                合同金额
              </th>
              <th class="text-xs min-w-[70px] py-3 px-2 font-medium text-black dark:text-white">
                合同付款计划期
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                已付金额
              </th>
              <th class="text-xs min-w-[80px] py-3 px-2 font-medium text-black dark:text-white">
                付款日期
              </th>
              <th class="text-xs min-w-[80px] py-3 px-2 font-medium text-black dark:text-white">
                未付金额
              </th>
            </tr>
          </thead>

          <tbody>
            <tr class="bg-white dark:bg-slate-300 items-center" v-for="(item, index) in tableData" :key="index">
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ (pageInfo.currentPage - 1) * 6 + index + 1 }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-primary">
                  {{ item.contract.contractId }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.contract.contractName }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.contract.contractSigndate }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.contract.contractEnddate }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.contract.contractCost }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.payPlan }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.moneyPaid }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.payDate }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.moneyNotpaid }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 无数据显示 -->
      <div v-if="tableData.length === 0"
        class="h-48 border-t flex items-center justify-center border-slate-300 text-2xl font-bold bg-slate-200 w-full">
        暂无数据
      </div>

      <!-- 分页 -->
      <Pagination @pageChange="handlePageChange" :pageCount="pageInfo.totalPages" :total="pageInfo.totalCount"
        :currentPage="pageInfo.currentPage"></Pagination>

    </div>
  </DefaultLayout>
</template>
