<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import QuestionTableLayout from "@/views/Question/QuestionTableLayout.vue";


const baseInfo = reactive( {
  data: {
    projectName : '',
    questionContent: '',
    createTime: '',
    questionType: '',
    person: '',
    commitUnit: '',
    status: ''
  }
})
const dialogVisible = ref(false);
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
    projectName: '项目4',
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
          <div>{{ row[idx.index] }}</div>
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
    <div v-if="tableData.length === 0" class="h-48 border-t flex items-center justify-center border-slate-300 text-2xl font-bold bg-slate-200 w-full">
      暂无数据
    </div>
    <Pagination @pageChange="handlePageChange" pageCount="8" total="97"></Pagination>

    <el-dialog
        v-model="dialogVisible"
        title="基本信息"
        style="border-radius: 0.5rem"
    >
      <div class="grid grid-cols-4 infoBoxParent">
        <div>项目名称</div>
        <div>{{ baseInfo.data.projectName }}</div>
        <div>问题类型</div>
        <div>{{baseInfo.data.questionType }}</div>
        <div>状态</div>
        <div>{{baseInfo.data.status}}</div>
        <div>填报人</div>
        <div>{{baseInfo.data.person }}</div>
        <div>填报单位</div>
        <div>{{baseInfo.data.commitUnit }}</div>
        <div>创建时间</div>
        <div>{{baseInfo.data.createTime }}</div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="background-color: #F6F6F6">日志内容</div>
        <div  class="w-3/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8;">{{ baseInfo.data.questionContent }}</div>
      </div>
    </el-dialog>
  </DefaultLayout>
</template>

<style scoped>


</style>