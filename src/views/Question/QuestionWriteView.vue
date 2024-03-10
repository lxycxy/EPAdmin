<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import QuestionTableLayout from "@/views/Question/QuestionTableLayout.vue";
import WriteIcon from "@/components/Icons/WriteIcon.vue";
import type{PaginationInfo} from "@/utils/Pagination";
import type{ProblemItemData} from "@/api/problem";
import * as problemApi from "@/api/problem";
import EButton from "@/components/Buttons/EButton.vue";
import * as projectApi from "@/api/project";
import type {Options} from "@/utils/Options";
import {ElMessage} from "element-plus";
import useUserStore from "@/stores/user";
import {recoverGTM8} from "@/utils/utils";


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
    index: 'problemSenddate'
  }

])

const originData = ref<ProblemItemData[]>([]);
const tableData = ref<ProblemItemData[]>([]);
const options = ref<Options[]>([])
const getProblemData = () => {
  problemApi.getProblemData()
      .then((resp) => {
        originData.value = resp.data.problems
        for (const item of originData.value) {
          item.projectName = item.project.projectName
        }
        computedPaginationInfo(originData.value.length)
      })
      .catch(resp => {
        console.log(resp)
      })
}

getProblemData();

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

const cancelCommit = () => {
  writeModel.value = false;
  dialogVisible.value = false;
}

const openWriteDialog = (row : any) => {
  baseInfo = reactive({...row})
  writeModel.value = true
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
        const typeOK = data.questionType == '' || item.problemType == data.questionType
        const projectNameOK = data.projectName == '' || item.projectName == data.projectName
        const statusOk = data.status == '' || item.problemState == data.status
        console.log(typeOK && projectNameOK && statusOk)
        return typeOK && projectNameOK && statusOk
      }
  )
  computedPaginationInfo(originData.value.length)
}

const confirmCommit = () => {

  if (baseInfo.projectId == undefined || baseInfo.problemDescription == undefined || baseInfo.problemType == undefined) {
    ElMessage({
      message: '填报内容不可存在空值',
      type: 'warning'
    })
    return
  }

  baseInfo.problemSenddate = recoverGTM8(new Date())
  baseInfo.project = {projectId: baseInfo.projectId}
  baseInfo.problemState = '待处理'
  baseInfo.problemSender = useUserStore().username

  problemApi.createProblemData(baseInfo)
      .then(resp => {
        if (resp.status == 'CREATED') {
          ElMessage({
            message: '填报成功',
            type: "success"
          })
          getProjectData();
        }
      })

  cancelCommit();
}

const handleReset = () => {
  getProblemData();
  pageInfo.currentPage = 1;
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

const pageTitle = ref('问题填报')
</script>

<template>
  <DefaultLayout>

    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <QuestionTableLayout @clickSearch="searchData" @clickReset="handleReset">
    </QuestionTableLayout>
    <div class="h-10 mt-3">
      <EButton @click="openWriteDialog" class="bg-meta-5 h-full w-20">
        <WriteIcon class="h-4 w-4"/>
        填报
      </EButton>
    </div>
    <div class="w-full bg-white p-5 mt-3 rounded-lg dark:bg-black shadow-md">
      <table class=" w-full mt-3 rounded-lg">
        <tr class="h-14 bg-slate-100 dark:bg-form-strokedark">
          <th v-for="item in columnsHeader" :key="item.index">{{ item.title }}</th>
          <th>操作</th>
        </tr>
        <tr
            class="bg-white dark:bg-boxdark dark:text-white dark:hover:text-black hover:bg-slate-100 border-slate-200 transition h-10 text-center"
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
        v-model="writeModel"
        @close="cancelCommit"
        title="问题填报"
        style="border-radius: 0.5rem; width: 30rem"
    >
      <div class="grid grid-cols-2 gap-2">
        <div class="info-box">项目名称</div>
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
        <div class="info-box">问题类型</div>
        <el-input v-model="baseInfo.problemType" placeholder="请输入" class="h-full w-full"/>
        <div  class="info-box flex items-center justify-center" style="height: 94px">问题描述</div>
        <el-input
            v-model="baseInfo.problemDescription"
            resize="none"
            rows="4"
            type="textarea"
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
        @close="cancelCommit"
        title="基本信息"
        style="border-radius: 0.5rem"
    >
      <div class="grid grid-cols-4 infoBoxParent">
        <div>问题编号</div>
        <div>{{baseInfo.problemId}}</div>
        <div>项目名称</div>
        <div>{{ baseInfo.projectName }}</div>
        <div>问题类型</div>
        <div>{{baseInfo.problemType }}</div>
        <div>状态</div>
        <div>{{baseInfo.problemState}}</div>
        <div>处理人</div>
        <div>{{baseInfo.problemHandler}}</div>
        <div>创建时间</div>
        <div>{{baseInfo.problemSenddate}}</div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="background-color: #F6F6F6;border: 0.5px solid #E8E8E8;">问题描述</div>
        <div class="w-3/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8;">
          <span>{{baseInfo.problemDescription}}</span>
        </div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="background-color: #F6F6F6; border: 0.5px solid #E8E8E8;">问题建议</div>
        <div class="w-3/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8;">
          <span>{{baseInfo.problemAdviced}}</span>
        </div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="background-color: #F6F6F6;border: 0.5px solid #E8E8E8;">处理方式</div>
        <div class="w-3/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8;">
          <span>{{baseInfo.problemHandleway}}</span>
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