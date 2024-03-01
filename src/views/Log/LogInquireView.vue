<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import LogTableLayout from "@/views/Log/LogTableLayout.vue";


const logBaseInfo = reactive( {
  data: {
    logNo : '',
    projectName : '',
    logContent: '',
    commitTime: '',
    isDelay: '',
    commuter: '',
    releaseTime: ''
  }
})
const dialogVisible = ref(false);
const columnsHeader = ref([
  {
    title: '日志编号',
    index: 'logNo'
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
    index: 'commitTime'
  },
  {
    title: '日志下发时间',
    index: 'releaseTime'
  },
  {
    title: '是否逾期',
    index: 'isDelay'
  },
  {
    title: '填报人',
    index: 'commuter'
  }

])

const originData = ref([
  {
    logNo: 1,
    projectName: '项目1',
    logContent: "log content..",
    commitTime: 'xxxx-xx-xx: xx:xx:xx',
    isDelay: true,
    commuter: 'lxxx',
    releaseTime: 'xxxxx:xxx'
  },
  {
    logNo: 2,
    projectName: '项目2',
    logContent: "log content..",
    commitTime: 'xxxx-xx-xx: xx:xx:xx',
    isDelay: true,
    commuter: 'lxxx',
    releaseTime: 'xxxxx:xxx'
  },
  {
    logNo: 3,
    projectName: '项目3',
    logContent: "log content..",
    commitTime: 'xxxx-xx-xx: xx:xx:xx',
    isDelay: true,
    commuter: 'lxxx',
    releaseTime: 'xxxxx:xxx'
  },
  {
    logNo: 4,
    projectName: '项目4',
    logContent: "log content..",
    commitTime: 'xxxx-xx-xx: xx:xx:xx',
    isDelay: true,
    commuter: 'lxxx',
    releaseTime: 'xxxxx:xxx'
  },
])

let tableData = ref([...originData.value])

console.log(tableData)
const handlePageChange = (currentPage : number) => {
  console.log(currentPage);
}

const openLogPage = (row : any) => {
  logBaseInfo.data = row
  dialogVisible.value = true
}

const searchData = (data : any) => {

  tableData.value = tableData.value.filter(
      item => {
        console.log(item.isDelay, data.isDelay)
        const logNoOk = data.logNo == '' || item.logNo == data.logNo
        const projectNameOK = data.projectName == '' || item.projectName == data.projectName
        const isDelayOk = data.isDelay == '' || item.isDelay == data.isDelay
        return logNoOk && projectNameOK && isDelayOk
      }
  )


}

const handleReset = () => {
  tableData.value = [...originData.value]
}

</script>

<template>
  <DefaultLayout>
    <LogTableLayout @clickSearch="searchData" @clickReset="handleReset"></LogTableLayout>
    <table class="w-full mt-5 rounded-lg">
      <tr class="h-14 bg-slate-200 dark:bg-form-strokedark">
        <th v-for="item in columnsHeader" :key="item.index">{{ item.title }}</th>
      </tr>
      <tr
          class="bg-white dark:bg-boxdark dark:text-white dark:hover:text-black hover:bg-slate-200 border-slate-200 transition odd:border-b odd:border-t h-10 text-center"
          v-for="(row, index) in tableData" :key="index"
      >
        <td v-for="idx in columnsHeader" :key="idx.index" class="max-w-30 truncate">
          <a v-if="idx.index === 'logNo'" class="text-primary hover:cursor-pointer" @click="openLogPage(row)" > {{ row[idx.index] }} </a>
          <div v-else>{{ row[idx.index] }}</div>
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
        <div >日志编号</div>
        <div >{{ logBaseInfo.data.logNo }}</div>
        <div >项目名称</div>
        <div >{{logBaseInfo.data.projectName}}</div>
        <div >填报人</div>
        <div>{{logBaseInfo.data.commuter}}</div>
        <div>填报时间</div>
        <div>{{logBaseInfo.data.commitTime}}</div>
        <div>日志下发时间</div>
        <div>{{logBaseInfo.data.releaseTime}}</div>
        <div>是否逾期</div>
        <div>{{logBaseInfo.data.isDelay}}</div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="background-color: #F6F6F6">日志内容</div>
        <div  class="w-3/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8;">{{ logBaseInfo.data.logContent }}</div>
      </div>
    </el-dialog>
  </DefaultLayout>
</template>

<style scoped>


</style>