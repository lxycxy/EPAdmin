<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import QuestionTableLayout from "@/views/Question/QuestionTableLayout.vue";
import WriteIcon from "@/components/Icons/WriteIcon.vue";
import type{PaginationInfo} from "@/utils/Pagination";
import type{ProblemItemData} from "@/api/problem";
import * as problemApi from "@/api/problem";


let pageInfo: PaginationInfo = reactive({}) as PaginationInfo
let baseInfo: ProblemItemData = reactive({}) as ProblemItemData
const dialogVisible = ref(false);
const writeModel = ref(false)
const columnsHeader = ref([
  {
    title: '问题编号',
    index:'problemId'
  },
  {
    title: '项目名称',
    index: 'projectName'
  },
  {
    title: '问题类型',
    index: 'problemType'
  },
  {
    title: '状态',
    index: 'problemState'
  },
  {
    title: '问题描述',
    index: 'problemDescription'
  },
  {
    title: '处理人',
    index: 'problemHandler'
  },
  {
    title: '创建时间',
    index: 'problemSendDate'
  }

])

const originData = ref<ProblemItemData[]>([]);
const tableData = ref<ProblemItemData[]>([]);

const getProblemData = () => {
  problemApi.getProblemData()
      .then((resp) => {
        originData.value = resp.data
        pageInfo.totalCount = originData.value.length;
        pageInfo.pageSize = 8;
        pageInfo.totalPages = Math.ceil(pageInfo.totalCount / pageInfo.pageSize);
        pageInfo.currentPage = 1;
        tableData.value = [...originData.value]
            .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
      })
      .catch(resp => {
        console.log(resp)
      })
}

getProblemData();

const handlePageChange = (currentPage : number) => {
  pageInfo.currentPage = currentPage;
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}


const cancelCommit = () => {
  writeModel.value = false;
  dialogVisible.value = false;
}

const openWriteDialog = (row : any) => {
  baseInfo = {...row}
  dialogVisible.value = true
  writeModel.value = true
}

const openDialog = (row : any) => {
  baseInfo = {...row}
  dialogVisible.value = true
}

const searchData = (data : any) => {

  tableData.value = tableData.value.filter(
      item => {
        const typeOK = data.questionType == '' || item.problemType == data.questionType
        const projectNameOK = data.projectName == '' || item.projectName == data.projectName
        const statusOk = data.status == '' || item.problemState == data.status
        console.log(typeOK && projectNameOK && statusOk)
        return typeOK && projectNameOK && statusOk
      }
  )


}

const handleReset = () => {
  pageInfo.currentPage = 1;
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

</script>

<template>
  <DefaultLayout>
    <QuestionTableLayout @clickSearch="searchData" @clickReset="handleReset">
    </QuestionTableLayout>
    <div class="h-10 mt-3">
      <button @click="openWriteDialog" class="bg-meta-5 text-white rounded-xl hover:ring-1 hover:-translate-y-1 transition ring-meta-5 h-full w-20 justify-around flex items-center">
        <WriteIcon class="h-4 w-4"/>
        填报
      </button>
    </div>
    <table class="w-full mt-3 rounded-lg">
      <tr class="h-14 bg-slate-200 dark:bg-form-strokedark">
        <th v-for="item in columnsHeader" :key="item.index">{{ item.title }}</th>
        <th>操作</th>
      </tr>
      <tr
          class="bg-white dark:bg-boxdark dark:text-white dark:hover:text-black hover:bg-slate-200 border-slate-200 transition odd:border-b odd:border-t h-10 text-center"
          v-for="(row, index) in tableData" :key="index"
      >
        <td v-for="idx in columnsHeader" :key="idx.index" class="max-w-30 truncate">
          {{ row[idx.index as keyof typeof row] }}
        </td>
        <td>
          <a @click="openDialog(row)" class="text-meta-3 cursor-pointer mr-2 hover:font-semibold ">
            查看
          </a>
        </td>
      </tr>
    </table>
    <div v-if="tableData.length === 0" class="h-48 border-t flex items-center justify-center border-slate-300 text-2xl font-bold bg-slate-200 w-full">
      暂无数据
    </div>

    <Pagination
        @pageChange="handlePageChange"
        :pageCount="pageInfo.totalPages"
        :total="pageInfo.totalCount"
        :currentPage="pageInfo.currentPage"
    ></Pagination>

    <el-dialog
        v-model="dialogVisible"
        @close="cancelCommit"
        title="基本信息"
        style="border-radius: 0.5rem"
    >
      <div class="grid grid-cols-4 infoBoxParent">
        <div>项目名称</div>
        <div>{{ baseInfo.projectName }}</div>
        <div>问题类型</div>
        <div>{{baseInfo.problemType }}</div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="background-color: #F6F6F6">问题描述</div>
        <div class="w-3/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8;">
          <el-input
              v-if="writeModel"
              v-model="baseInfo.problemDescription"
              type="textarea"
              style="height: 100%"
              resize="none"
              rows="4"
          />
          <span v-else>{{baseInfo.problemDescription}}</span>
        </div>
      </div>
      <div v-if="writeModel" class="flex justify-end space-x-6 h-10 mt-5">
        <button @click="cancelCommit" class="w-18 transition hover:ring-1 ring-slate-400 hover:-translate-y-1 text-white bg-slate-400 rounded" >
          取消
        </button>
        <button class="w-18 text-white transition hover:ring-1 ring-meta-3  hover:-translate-y-1 bg-meta-3 rounded">
          提交
        </button>
      </div>
    </el-dialog>
  </DefaultLayout>
</template>

<style scoped>

</style>