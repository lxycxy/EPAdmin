<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import QuestionTableLayout from "@/views/Question/QuestionTableLayout.vue";
import WriteIcon from "@/components/Icons/WriteIcon.vue";


const baseInfo = reactive( {
  data: {
    projectName : '',
    commitTime: '',
    questionContent: '',
  }
})
const dialogVisible = ref(false);
const writeModel = ref(false)
const columnsHeader = ref([
  {
    title: '项目名称',
    index: 'projectName'
  },
  {
    title: '问题类型',
    index: 'questionType'
  },
  {
    title: '状态',
    index: 'status'
  },
  {
    title: '问题描述',
    index: 'questionContent'
  },
  {
    title: '填报人',
    index: 'person'
  },
  {
    title: '填报单位',
    index: 'commitUnit'
  },
  {
    title: '创建时间',
    index: 'createTime'
  }

])

const originData = ref([
  {
    projectName: '项目1',
    questionType: "....问题",
    status: '待处理',
    questionContent: '......content....',
    person: 'lxx',
    createTime: 'xxxxx:xxx',
    commitUnit: 'xxxx公司'
  },
  {
    projectName: '项目2',
    questionType: "....问题",
    status: '待处理',
    questionContent: '......content....',
    person: 'lxx',
    createTime: 'xxxxx:xxx',
    commitUnit: 'xxxx公司'
  }, {
    projectName: '项目3',
    questionType: "....问题",
    status: '待处理',
    questionContent: '......content....',
    person: 'lxx',
    createTime: 'xxxxx:xxx',
    commitUnit: 'xxxx公司'
  }, {
    projectName: '项目1',
    questionType: "....问题",
    status: '待处理',
    questionContent: '......content....',
    person: 'lxx',
    createTime: 'xxxxx:xxx',
    commitUnit: 'xxxx公司'
  }, {
    projectName: '项目1',
    questionType: "....问题",
    status: '待处理',
    questionContent: '......content....',
    person: 'lxx',
    createTime: 'xxxxx:xxx',
    commitUnit: 'xxxx公司'
  }, {
    projectName: '项目1',
    questionType: "....问题",
    status: '待处理',
    questionContent: '......content....',
    person: 'lxx',
    createTime: 'xxxxx:xxx',
    commitUnit: 'xxxx公司'
  }, {
    projectName: '项目1',
    questionType: "....问题",
    status: '待处理',
    questionContent: '......content....',
    person: 'lxx',
    createTime: 'xxxxx:xxx',
    commitUnit: 'xxxx公司'
  },
])

let tableData = ref([...originData.value])

const handlePageChange = (currentPage : number) => {
  console.log(currentPage);
}

const cancelCommit = () => {
  writeModel.value = false;
  dialogVisible.value = false;
}

const openWriteDialog = (row : any) => {
  baseInfo.data = {...row}
  dialogVisible.value = true
  writeModel.value = true
}

const openDialog = (row : any) => {
  baseInfo.data = {...row}
  dialogVisible.value = true
}

const searchData = (data : any) => {

  tableData.value = tableData.value.filter(
      item => {
        const typeOK = data.questionType == '' || item.questionType == data.questionType
        const projectNameOK = data.projectName == '' || item.projectName == data.projectName
        const statusOk = data.status == '' || item.status == data.status
        console.log(typeOK && projectNameOK && statusOk)
        return typeOK && projectNameOK && statusOk
      }
  )


}

const handleReset = () => {
  tableData.value = [...originData.value]
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
          {{row[idx.index]}}
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

    <Pagination @pageChange="handlePageChange" pageCount="8" total="97"></Pagination>

    <el-dialog
        v-model="dialogVisible"
        @close="cancelCommit"
        title="基本信息"
        style="border-radius: 0.5rem"
    >
      <div class="grid grid-cols-4 infoBoxParent">
        <div>项目名称</div>
        <div>{{ baseInfo.data.projectName }}</div>
        <div>问题类型</div>
        <div>{{baseInfo.data.commitTime }}</div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="background-color: #F6F6F6">问题描述</div>
        <div class="w-3/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8;">
          <el-input
              v-if="writeModel"
              v-model="baseInfo.data.questionContent"
              type="textarea"
              style="height: 100%"
              resize="none"
              rows="4"
          />
          <span v-else>{{baseInfo.data.questionContent}}</span>
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