<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SearchInput from "@/components/Input/SearchInput1.vue"
import Pagination from "@/components/Buttons/Pagination.vue"
import type { PaginationInfo } from "@/utils/Pagination";
import type { SearchConditions, InspectRecord } from '@/api/quality';
import * as qualityApi from '@/api/quality'

let conditions: SearchConditions = reactive({}) as SearchConditions

const resultOp = [
  "优秀",
  "良好",
  "合格",
  "不合格"
]

const originData = ref<InspectRecord[]>([])
const tableData = ref<InspectRecord[]>([])
let detailData: InspectRecord = reactive({}) as InspectRecord

let pageInfo: PaginationInfo = reactive({}) as PaginationInfo
const handlePageChange = (currentPage: number) => {
  pageInfo.currentPage = currentPage;
  tableData.value = [...originData.value]
    .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

const getInspectData = () => {
  qualityApi.getInspectData()
    .then(resp => {
      originData.value = resp.data.qualities
      
      pageInfo.totalCount = originData.value.length;
      pageInfo.pageSize = 9;
      pageInfo.totalPages = Math.ceil(pageInfo.totalCount / pageInfo.pageSize);
      pageInfo.currentPage = 1;
      tableData.value = [...originData.value]
        .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
    })
    .catch(resp => {
      console.log(resp)
    })
}
getInspectData();

const addDialogVisible = ref(false)
const addInspectDialog = () => {
  addDialogVisible.value = true
}
const closeAddInspectDialog = () => {
  addDialogVisible.value = false;
  detailData = reactive({}) as InspectRecord
}
  /* 添加质检记录 */
const addInspectRecord = () => {
  if (detailData.checkId == undefined || detailData.checker == undefined ||
    detailData.checkResult == undefined || detailData.checkDate == undefined ||
    detailData.checkId == '' || detailData.checker == ''
  ) {
    ElMessage({
      type: 'warning',
      message: '请填写必填信息',
    })
  }
  else {
    ElMessageBox.confirm(
      '是否要添加一个新的质检记录?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
      .then(() => {
        qualityApi.checkCheckId(detailData.checkId)
          .then(resp => {
            console.log(resp.data);
            if (resp.data.qualities.checkId != null) {
              ElMessage({
                type: 'error',
                message: '质检编号已存在，请重新填写质检编号',
              })
            }
            else {
              qualityApi.addInspectRecord(detailData)
                .then(() => {
                  ElMessage({
                    type: 'success',
                    message: '添加成功',
                  })
                  getInspectData()
                  closeAddInspectDialog();
                })
            }
          })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '撤销添加',
        })
      })
  }
}

const searchData = () => {
  console.log(conditions);
}
const resetSearch = () => {
  conditions = reactive({}) as SearchConditions;
  getInspectData();
}

const pageTitle = ref('质量检测')
</script>

<template>
  <DefaultLayout>

    <!-- 新增支付记录对话框 -->
    <el-dialog v-model="addDialogVisible" title="新增质检记录记录" width="800" align-center class="p-10"
      @close="closeAddInspectDialog()">
      <div class="rounded-lg px-6">
        <p>基本信息</p>

        <!-- 填报内容 -->
        <div class="grid grid-cols-12 mt-5">
          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">质检编号</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              v-model="detailData.checkId" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">质检人</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              v-model="detailData.checker" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">质检结果</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="detailData.checkResult" class="w-full text-xs" placeholder="" size="small">
              <el-option v-for="item in resultOp" :key="item" :label="item" :value="item" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">质检日期</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="detailData.checkDate" type="date" placeholder="" size="small" />
          </div>

          <div class="col-start-11 col-end-11">
            <button
              @click="addInspectRecord()"
              class="flex justify-around items-center bg-primary text-white rounded-lg w-14 p-1.5 text-xs ml-auto mt-5 mb-2 hover:bg-opacity-50">
              确定
            </button>
          </div>
          <div class="col-start-12 col-end-12">
            <button
              class="flex justify-around items-center bg-white text-black border rounded-lg w-14 p-1.5 text-xs ml-auto mt-5 mb-2 hover:bg-gray"
              @click="closeAddInspectDialog()">
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
      <div class="rounded-2xl bg-white dark:bg-boxdark flex items-center flex-wrap justify-center">
        <SearchInput class="text-xs max-w-100  ml-5" label="质检编号" placeholder="输入项目名称" v-model="conditions.checkId">
        </SearchInput>

        <div class="flex items-center ml-4">
          <p class="text-xs">质检日期</p>
          <el-date-picker v-model="conditions.checkDate" type="daterange" range-separator="至" start-placeholder="开始时间"
            end-placeholder="结束时间" class="m-2 max-w-100" value-format="YYYY-MM-DD" style="width: 200px;" />
        </div>

        <button
          @click="searchData()"
          class="flex justify-around items-center bg-primary text-white rounded-lg w-15 p-1.5 text-xs ml-auto m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
            <path fill="#ffffff"
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
          查询
        </button>

        <button
          @click="resetSearch()"
          class="flex justify-around justify-end items-center bg-meta-3 text-white rounded-lg w-15 p-1.5 text-xs m-2 hover:ring-1 hover:ring-meta-3 hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20" width="20">
            <path fill="#ffffff"
              d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z" />
          </svg>
          重置
        </button>
      </div>

      <!-- 操作区 -->
      <div class="flex items-center flex-wrap mt-2">
        <button @click="addInspectDialog()"
          class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 448 512">
            <path fill="#ffffff"
              d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>
          新增
        </button>
      </div>

      <div class="max-h-400 overflow-y-auto mt-1">
        <!-- 表格 -->
        <table class="w-full table-wrapper rounded-lg">
          <!-- 表头 -->
          <thead>
            <tr class="bg-slate-300 text-center dark:bg-meta-4">
              <th class="text-xs min-w-[50px] py-1 px-2 font-medium text-black dark:text-white">
                序号
              </th>
              <th class="text-xs min-w-[150px] py-1 px-2 font-medium text-black dark:text-white">
                质检编号
              </th>
              <th class="text-xs font-normal min-w-[150px] py-1 px-2 font-medium text-black dark:text-white">
                质检人
              </th>
              <th class="text-xs min-w-[150px] py-3 px-2 font-medium text-black dark:text-white">
                质检日期
              </th>
              <th class="text-xs min-w-[150px] py-2 px-2 font-medium text-black dark:text-white">
                质检结果
              </th>
            </tr>
          </thead>

          <tbody>
            <tr class="bg-white dark:bg-slate-300 items-center" v-for="(item, index) in tableData" :key="index">
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ (pageInfo.currentPage - 1) * 9 + index + 1 }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.checkId }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.checker }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.checkDate }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.checkResult }}</p>
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
        :currentPage="pageInfo.currentPage">
      </Pagination>
    </div>
  </DefaultLayout>
</template>
