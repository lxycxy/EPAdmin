<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import type{logItemData} from "@/api/log";
import type{PaginationInfo} from "@/utils/Pagination";
import * as logApi from "@/api/log";
import useUserStore from "@/stores/user";
import {ElMessage} from "element-plus";
import WriteLogTableLayout from "@/views/Log/WriteLogTableLayout.vue";
import {recoverGTM8} from "@/utils/utils";

const userStore = useUserStore()
const writeModel = ref(false)

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
    title: '填报状态',
    index: 'logState'
  },
  {
    title: '逾期时间',
    index: 'logBeyondDate'
  },
  {
    title: '下发时间',
    index: 'logSignDate'
  },
])


let pageInfo : PaginationInfo = reactive({}) as PaginationInfo
const originData = ref<logItemData[]>([]);
const tableData = ref<logItemData[]> ([]);
const getLogTableData = () => {
  logApi.getLogData()
      .then(resp => {
        originData.value = resp.data.logs
        for (let item of originData.value) {
          item.projectName = item.project.projectName
          item.projectId = item.project.projectId
        }

        computedPaginationInfo(originData.value.length)

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

const cancelCommit = () => {
  writeModel.value = false;
  dialogVisible.value = false;
}

const openDialog = (row : any) => {
  baseInfo = reactive({...row})
  dialogVisible.value = true
}

const openWriteDialog = (row : any) => {
  dialogVisible.value = true
  baseInfo = reactive({...row})
  writeModel.value = true

}

const computedPaginationInfo = (count : number) => {
  pageInfo.totalCount = count;
  pageInfo.pageSize = 8;
  pageInfo.totalPages = Math.ceil(pageInfo.totalCount / pageInfo.pageSize);
  pageInfo.currentPage = 1;
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}
const searchData = (data : any) => {

  originData.value = originData.value.filter(
      item => {
        const logNoOk = data.logId == '' || item.logId == data.logId
        const projectNameOK = data.projectName == '' || item.projectName == data.projectName
        const logStateOk = data.logState == '' || item.logState == data.logState

        return logNoOk && projectNameOK && logStateOk
      }
  )

  computedPaginationInfo(originData.value.length)
}

const handleReset = () => {
  getLogTableData();
  pageInfo.currentPage = 1;
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

const confirmCommit = () => {

  if (baseInfo.logContent == null || baseInfo.logContent.length == 0 ) {
    ElMessage({
      message: '日志内容未填写',
      type: "warning"
    })
    return
  }

  baseInfo.logState = '已填报'
  baseInfo.logSender = userStore.username


  baseInfo.logDate = recoverGTM8(new Date())
  logApi.commitFillLog(baseInfo)
      .then(resp => {
        if (resp.statusCode === 200) {
          ElMessage({
            message: "提交成功",
            type: "success"
          })
          getLogTableData();
        } else {
          ElMessage({
            message: "提交失败",
            type: "error"
          })
        }
      })

  cancelCommit();
}

const pageTitle = ref('日志填报')
</script>

<template>
  <DefaultLayout>

    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <WriteLogTableLayout @clickSearch="searchData" @clickReset="handleReset"></WriteLogTableLayout>
    <div class="w-full bg-white p-5 mt-3 rounded-lg dark:bg-black shadow-md">
      <table class=" w-full mt-3 rounded-lg">
        <tr class="h-14 bg-slate-100 dark:bg-form-strokedark">
          <th v-for="item in columnsHeader" :key="item.index">{{ item.title }}</th>
          <th>操作</th>
        </tr>
        <tr
            class="bg-white dark:bg-boxdark dark:text-white dark:hover:text-black hover:bg-slate-100 transition h-10 text-center"
            v-for="(row, index) in tableData" :key="index"
        >
          <td v-for="idx in columnsHeader" :key="idx.index" class="max-w-30 truncate">
            <a v-if="idx.index === 'logId'" class="text-primary hover:cursor-pointer" @click="openDialog(row)" > {{ row[idx.index as keyof typeof row] }} </a>
            <div v-else>{{ row[idx.index as keyof typeof row]}}</div>
          </td>
          <td>
            <a @click="openDialog(row)" class="text-meta-3 cursor-pointer mr-2 hover:font-semibold ">
              查看
            </a>
            <a v-if="row.logState==='未填报'" class="text-primary transition hover:font-bold cursor-pointer" @click="openWriteDialog(row)">
              填写
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
     ></Pagination>

    <el-dialog
        v-model="dialogVisible"
        title="基本信息"
        style="border-radius: 0.5rem"
        @close="cancelCommit"
    >
      <div class="grid grid-cols-4 infoBoxParent">
        <div >日志编号</div>
        <div >{{ baseInfo.logId }}</div>
        <div >项目名称</div>
        <div >{{baseInfo.projectName}}</div>
        <div >填报人</div>
        <div>{{ baseInfo.logSender == null ? userStore.username: baseInfo.logSender }}</div>
        <div>逾期时间</div>
        <div>{{ baseInfo.logBeyondDate }}</div>
        <div>日志下发时间</div>
        <div>{{ baseInfo.logSignDate }}</div>
        <div>是否逾期</div>
        <div>{{ baseInfo.isDelay }}</div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8; background-color: #F6F6F6">日志内容</div>
        <div v-if="! writeModel" class="w-3/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8;">{{ baseInfo.logContent }}</div>
        <div v-else class="w-3/4 h-full flex justify-center items-center">
          <el-input
              v-model="baseInfo.logContent"
              type="textarea"
              style="height: 100%"
              resize="none"
              rows="4"
          />
        </div>
      </div>
      <div v-if="writeModel" class="flex justify-end space-x-6 h-10 mt-5">
        <button @click="cancelCommit" class="w-18 transition hover:ring-1 ring-slate-400 hover:-translate-y-1 text-white bg-slate-400 rounded" >
          取消
        </button>
        <el-popconfirm
            title="提交后不可修改，请确认"
            confirm-button-text="确认"
            cancel-button-text="取消"
            width="200"
            @confirm="confirmCommit"
        >
          <template #reference>
            <button class="w-18 text-white transition hover:ring-1 ring-meta-3  hover:-translate-y-1 bg-meta-3 rounded">
              提交
            </button>
          </template>
        </el-popconfirm>
      </div>
    </el-dialog>
  </DefaultLayout>
</template>

<style scoped>


</style>