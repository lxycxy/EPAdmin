<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import * as logApi from '@/api/log';
import * as projectApi from '@/api/project'
import type {logItemData} from "@/api/log";
import type {PaginationInfo} from "@/utils/Pagination";
import SendIcon from "@/components/Icons/SendIcon.vue";
import EButton from "@/components/Buttons/EButton.vue";
import type {Options} from "@/utils/Options";
import {ElMessage} from "element-plus";
import InquireLogTableLayout from "@/views/Log/InquireLogTableLayout.vue";
import {recoverGTM8} from "@/utils/utils";


let baseInfo: logItemData = reactive({}) as logItemData;
const dialogVisible = ref(false);
const writeDialogVisible = ref(false);

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
const originData = ref<logItemData[]>([]);
const tableData = ref<logItemData[]> ([]);
const options = ref<Options[]>([]);

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

const getProjectData = () => {
  projectApi.getProjectData()
      .then(resp => {
        for (const item of resp.data.projects) {
          options.value.push({label: item.projectName, value: item.projectId})
        }
      })
}

getProjectData();
const handlePageChange = (currentPage : number) => {
  pageInfo.currentPage = currentPage;
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

const openDialog = (row : any) => {
  baseInfo = reactive({...row})
  dialogVisible.value = true
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
        const isDelayOk = data.isDelay == '' || item.isDelay == data.isDelay

        return logNoOk && projectNameOK && isDelayOk
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

const openWriteDialog = () => {

  baseInfo.logBeyondDate = recoverGTM8(new Date());

  writeDialogVisible.value = true;
}

const cancelCommit = () => {
  baseInfo = reactive({}) as logItemData
  writeDialogVisible.value = false
}

const confirmCommit = () => {

  if (baseInfo.projectId == undefined) {
    ElMessage({
      message: '未选择项目',
      type: 'error'
    })
    return
  }


  baseInfo.logSignDate = recoverGTM8(new Date());
  baseInfo.logState = '未填报'
  baseInfo.logBeyondDate = recoverGTM8(baseInfo.logBeyondDate)
  baseInfo.project = {projectId: baseInfo.projectId}

  logApi.createLog(baseInfo)
      .then(resp => {
        if (resp.data.status === 'CREATED') {
          ElMessage({
            message: "发布成功",
            type: "success"
          })
          getLogTableData();
        } else {
          ElMessage({
            message: "发布失败",
            type: "error"
          })
        }
      })
      .catch(resp => {
        console.log(resp)
      })
  cancelCommit();
}

</script>

<template>
  <DefaultLayout>
    <InquireLogTableLayout @clickSearch="searchData" @clickReset="handleReset"></InquireLogTableLayout>
    <div class="h-12 mt-3">
      <EButton @click="openWriteDialog" class="bg-meta-5 h-11 w-24">
        <SendIcon class="w-4 h-4"/>
        下发日志
      </EButton>
    </div>
    <div class="w-full bg-white p-5 mt-3 rounded-lg dark:bg-black shadow-md">
      <table class="w-full mt-3 rounded-lg">
        <tr class="h-14 bg-slate-100 dark:bg-form-strokedark" >
          <th  v-for="item in columnsHeader" :key="item.index">{{ item.title }}</th>
          <th>操作</th>
        </tr>
        <tr
            class="bg-white dark:bg-boxdark dark:text-white dark:hover:text-black hover:bg-slate-100 transition h-10 text-center"
            v-for="(row, index) in tableData" :key="index"
        >
          <td v-for="idx in columnsHeader" :key="idx.index" class="max-w-30 truncate">
            <a v-if="idx.index === 'logId'" class="text-primary hover:cursor-pointer" @click="openDialog(row)"> {{ row[idx.index as keyof typeof row]}} </a>
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

    </div>

    <el-dialog
      v-model="writeDialogVisible"
      title="下发日志"
      style="border-radius: 0.5rem; width: 30rem;"
    >
      <div class="grid grid-cols-2 gap-2 items-center justify-items-center">
        <div class="info-box"> 项目名称 </div>
        <el-select
          v-model="baseInfo.projectId"
          filterable
          size="large"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="info-box">逾期时间</div>
        <el-date-picker
            v-model="baseInfo.logBeyondDate"
            size="large"
            type="datetime"
            placeholder="选择逾期时间"
        />
      </div>
      <div class="flex justify-end h-10 space-x-5 mt-5">
        <button class="w-18 transition hover:ring-1 ring-slate-400 hover:-translate-y-1 text-white bg-slate-400 rounded" @click="cancelCommit">
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
        <div >{{ baseInfo.projectName }}</div>
        <div >填报人</div>
        <div>{{ baseInfo.logSender }}</div>
        <div>填报时间</div>
        <div>{{ baseInfo.logDate }}</div>
        <div>日志下发时间</div>
        <div>{{ baseInfo.logSignDate }}</div>
        <div>是否逾期</div>
        <div>{{ baseInfo.isDelay }}</div>
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