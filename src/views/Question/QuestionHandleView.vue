<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import QuestionTableLayout from "@/views/Question/QuestionTableLayout.vue";
import type {ProblemItemData} from "@/api/problem";
import type {PaginationInfo} from "@/utils/Pagination";
import * as problemApi from '@/api/problem'
import useUserStore from "@/stores/user";
import {ElMessage} from "element-plus";
import {exportXLSX, recoverGTM8} from "@/utils/utils";
import FileExportIcon from "@/components/Icons/FileExportIcon.vue";
import EButton from "@/components/Buttons/EButton.vue";

let pageInfo: PaginationInfo = reactive({}) as PaginationInfo
let baseInfo: ProblemItemData = reactive({}) as ProblemItemData
const dialogVisible = ref(false);
const handleModel = ref(false);
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
    index: 'problemSendcompany'
  },
  {
    title: '创建时间',
    index: 'problemSenddate'
  }

])

const originData = ref<ProblemItemData[]>([]);
const tableData = ref<ProblemItemData[]>([]);

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

const computedPaginationInfo = (count : number) => {
  pageInfo.totalCount = count;
  pageInfo.pageSize = 8;
  pageInfo.totalPages = Math.ceil(pageInfo.totalCount / pageInfo.pageSize);
  pageInfo.currentPage = 1;
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}
const handlePageChange = (currentPage : number) => {
  pageInfo.currentPage = currentPage;
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

const openDialog = (row : any) => {
  baseInfo = reactive({...row})
  dialogVisible.value = true
}

const searchData = (data : any) => {

  originData.value = originData.value.filter(
      item => {
        const typeOK = data.questionType == '' || item.problemType == data.questionType
        const projectNameOK = data.projectName == '' || item.projectName == data.projectName
        const statusOk = data.status == '' || item.problemState == data.status

        return typeOK && projectNameOK && statusOk
      }
  )

  computedPaginationInfo(originData.value.length)
}

const handleReset = () => {
  getProblemData();
  pageInfo.currentPage = 1
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

const clickHandleProblem = (row : ProblemItemData) => {
  baseInfo = reactive({...row});
  handleModel.value = true;

}

const cancelCommit = () => {
  baseInfo = reactive({}) as ProblemItemData;
  handleModel.value = false;
}

const confirmCommit = () => {

  if (baseInfo.problemAdviced == null || baseInfo.problemHandleway == null) {
    ElMessage({
      message: '处理信息不可存在空值',
      type: 'error'
    })
    return
  }

  baseInfo.problemHandler = useUserStore().username
  baseInfo.problemHandleDate = recoverGTM8(new Date())
  baseInfo.problemState = '处理中'
  problemApi.postProblemHandleResult(baseInfo) // 提交问题处理
      .then((resp) => {
        if (resp.status == 'OK') {
          ElMessage({
            message: '处理提交成功',
            type: "success"
          })
          getProblemData();
        }
      })

  cancelCommit();
}

const clickClose = (row : ProblemItemData) => {
  row.problemState = '已关闭'
  problemApi.postProblemHandleResult(row)
      .then((resp) => {
        if (resp.status == 'OK') {
          ElMessage({
            message: '关闭成功',
            type: "success"
          })
          getProblemData();
        }
      })
}
const exportXLSXFile = () => {
  let fileData = [];

  for (const item of originData.value) {
    fileData.push({
      '问题编号': item.problemId,
      '项目名称': item.projectName,
      '问题类型': item.problemType,
      '状态': item.problemState,
      '问题描述': item.problemDescription,
      '填报人': item.problemSender,
      '创建时间': item.problemSenddate,
      '处理人': item.problemHandler
    })
  }


  exportXLSX(fileData, '问题列表');
}
</script>

<template>
  <DefaultLayout>
    <QuestionTableLayout @clickSearch="searchData" @clickReset="handleReset"></QuestionTableLayout>
    <div class="h-10 flex space-x-4 mt-3">
      <EButton @click="exportXLSXFile" class="bg-primary h-full w-20">
        <FileExportIcon class="w-4 h-4"/>
        导出
      </EButton>
    </div>
    <div class="w-full bg-white p-6 mt-3 rounded-lg dark:bg-black shadow-md">
      <table class="w-full mt-3 rounded-lg">
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
            <a v-if="row.problemState == '待处理'" @click="clickHandleProblem(row)" class="text-primary cursor-pointer hover:font-semibold">
              处理
            </a>
            <el-popconfirm
                v-else-if="row.problemState == '处理中'"
                title="提交后不可修改，请确认"
                confirm-button-text="确认"
                cancel-button-text="取消"
                width="200"
                @confirm="clickClose(row)"
            >
              <template #reference >
                <a class="text-meta-7 cursor-pointer hover:font-semibold">
                  关闭
                </a>
              </template>
            </el-popconfirm>

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
      v-model="handleModel"
      title="处理问题"
      style="border-radius: 0.5rem"
    >
      <div class="grid grid-cols-4 infoBoxParent">
        <div>项目名称</div>
        <div>{{ baseInfo.projectName }}</div>
        <div>问题类型</div>
        <div>{{baseInfo.problemType }}</div>
        <div>状态</div>
        <div>{{baseInfo.problemState}}</div>
        <div>填报时间</div>
        <div>{{baseInfo.problemSenddate}}</div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="background-color: #F6F6F6;border: 0.5px solid #E8E8E8;">问题建议</div>
        <div class="w-3/4 h-full flex justify-center items-center" >
          <el-input
              v-model="baseInfo.problemAdviced"
              resize="none"
              type="textarea"
              :rows="4"
          />
        </div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="background-color: #F6F6F6;border: 0.5px solid #E8E8E8;">处理方式</div>
        <div class="w-3/4 h-full flex justify-center items-center">
          <el-input
              v-model="baseInfo.problemHandleway"
              resize="none"
              type="textarea"
              :rows="4"
          />
        </div>
      </div>
      <div class="flex justify-end space-x-6 h-10 mt-5">
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
        <div>{{baseInfo.problemSendcompany }}</div>
        <div>创建时间</div>
        <div>{{baseInfo.problemSenddate }}</div>
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
    </el-dialog>
  </DefaultLayout>
</template>

<style scoped>


</style>