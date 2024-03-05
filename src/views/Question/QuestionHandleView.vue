<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import QuestionTableLayout from "@/views/Question/QuestionTableLayout.vue";
import type {ProblemItemData} from "@/api/problem";
import type {PaginationInfo} from "@/utils/Pagination";
import * as problemApi from '@/api/problem'

let pageInfo: PaginationInfo = reactive({}) as PaginationInfo
let baseInfo: ProblemItemData = reactive({}) as ProblemItemData
const dialogVisible = ref(false);
const columnsHeader = ref([
  {
    title: '问题编号',
    index: 'problemId'
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
    title: '填报人',
    index: 'problemSender'
  },
  {
    title: '填报单位',
    index: 'problemSendCompany'
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

        return typeOK && projectNameOK && statusOk
      }
  )
}

const handleReset = () => {
  pageInfo.currentPage = 1
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

</script>

<template>
  <DefaultLayout>
    <QuestionTableLayout @clickSearch="searchData" @clickReset="handleReset">

    </QuestionTableLayout>
    <div class="w-full bg-white p-6 mt-3 rounded-lg dark:bg-black shadow-md">
      <table class="data-table w-full mt-3 rounded-lg">
        <tr class="h-14 bg-slate-100 dark:bg-form-strokedark">
          <th v-for="item in columnsHeader" :key="item.index">{{ item.title }}</th>
          <th>操作</th>
        </tr>
        <tr
            class="bg-white dark:bg-boxdark dark:text-white dark:hover:text-black hover:bg-slate-100 border-slate-200 transition h-10 text-center"
            v-for="(row, index) in tableData" :key="index"
        >
          <td v-for="idx in columnsHeader" :key="idx.index" class="max-w-30 truncate">
            <div>{{ row[idx.index as keyof typeof row] }}</div>
          </td>
          <td>
            <a @click="openDialog(row)" class="text-meta-3 cursor-pointer mr-2 hover:font-semibold ">
              查看
            </a>
            <a class="text-primary cursor-pointer hover:font-semibold">
              处理
            </a>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="tableData.length === 0" class="h-48 border-t flex items-center justify-center border-slate-300 text-2xl font-bold bg-slate-200 w-full">
      暂无数据
    </div>
    <Pagination
        @pageChange="handlePageChange"
        :pageCount="pageInfo.totalPages"
        :total="pageInfo.totalCount"
        :currentPage="pageInfo.currentPage"
    >
    </Pagination>

    <el-dialog
        v-model="dialogVisible"
        title="基本信息"
        style="border-radius: 0.5rem"
    >
      <div class="grid grid-cols-4 infoBoxParent">
        <div>项目名称</div>
        <div>{{ baseInfo.projectName }}</div>
        <div>问题类型</div>
        <div>{{baseInfo.problemType }}</div>
        <div>状态</div>
        <div>{{baseInfo.problemState}}</div>
        <div>填报人</div>
        <div>{{baseInfo.problemSender }}</div>
        <div>填报单位</div>
        <div>{{baseInfo.problemSendCompany }}</div>
        <div>创建时间</div>
        <div>{{baseInfo.problemSendDate }}</div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="background-color: #F6F6F6">日志内容</div>
        <div  class="w-3/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8;">{{ baseInfo.problemDescription}}</div>
      </div>
    </el-dialog>
  </DefaultLayout>
</template>

<style scoped>


</style>