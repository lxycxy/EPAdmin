<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import LogTableLayout from "@/views/Log/LogTableLayout.vue";
import * as logApi from '@/api/log'
import type {logItemData} from "@/api/log";
import type {PaginationInfo} from "@/utils/Pagination";

let baseInfo: logItemData = reactive({}) as logItemData;

const dialogVisible = ref(false);

const columnsHeader = ref([
  {
    title: '日志编号',
    index: 'logId'
  },
  {
    title: '项目名称',
    index: 'projectName'
  },
  {
    title: '日志内容',
    index: 'logContent'
  },
  {
    title: '填报时间',
    index: 'logDate'
  },
  {
    title: '是否逾期',
    index: 'isDelay'
  },
  {
    title: '填报人',
    index: 'logSender'
  }

])

let pageInfo : PaginationInfo = reactive({}) as PaginationInfo
let cPage = ref(1);
const originData = ref<logItemData[]>([]);
const tableData = ref<logItemData[]> ([]);
const getLogTableData = () => {
    logApi.getLogData()
        .then(resp => {
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

getLogTableData();

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
        const logNoOk = data.logId == '' || item.logId == data.logId
        const projectNameOK = data.projectName == '' || item.projectName == data.projectName
        const isDelayOk = data.isDelay == '' || item.isDelay == data.isDelay

        return logNoOk && projectNameOK && isDelayOk
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
    <LogTableLayout @clickSearch="searchData" @clickReset="handleReset"></LogTableLayout>
    <table class="w-full mt-5 rounded-lg">
      <tr class="h-14 bg-slate-200 dark:bg-form-strokedark">
        <th v-for="item in columnsHeader" :key="item.index">{{ item.title }}</th>
        <th>操作</th>
      </tr>
      <tr
          class="bg-white dark:bg-boxdark dark:text-white dark:hover:text-black hover:bg-slate-200 border-slate-200 transition odd:border-b odd:border-t h-10 text-center"
          v-for="(row, index) in tableData" :key="index"
      >
        <td v-for="idx in columnsHeader" :key="idx.index" class="max-w-30 truncate">
          <a v-if="idx.index === 'logId'" class="text-primary hover:cursor-pointer" @click="openDialog(row)" > {{ row[idx.index as keyof typeof row]}} </a>
          <div v-else>{{ row[idx.index as keyof typeof row] }}</div>
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
        title="基本信息"
        style="border-radius: 0.5rem"
    >
      <div class="grid grid-cols-4 infoBoxParent">
        <div >日志编号</div>
        <div >{{ baseInfo.logId }}</div>
        <div >项目名称</div>
        <div >{{baseInfo.projectName}}</div>
        <div >填报人</div>
        <div>{{baseInfo.logSender}}</div>
        <div>填报时间</div>
        <div>{{baseInfo.logDate}}</div>
        <div>日志下发时间</div>
        <div>{{ baseInfo.logSignDate }}</div>
        <div>是否逾期</div>
        <div>{{baseInfo.isDelay}}</div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="background-color: #F6F6F6">日志内容</div>
        <div class="w-3/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8;">{{ baseInfo.logContent }}</div>
      </div>
    </el-dialog>
  </DefaultLayout>
</template>

<style scoped>


</style>