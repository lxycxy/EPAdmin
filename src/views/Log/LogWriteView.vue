<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import LogTableLayout from "@/views/Log/LogTableLayout.vue";

const writeModel = ref(false)

const baseInfo = reactive( {
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

const tableData = ref([...originData.value])

const cancelCommit = () => {
  writeModel.value = false;
  dialogVisible.value = false;
}
const handlePageChange = (currentPage : number) => {
  console.log(currentPage);
}

const openDialog = (row : any) => {
  baseInfo.data = {...row}
  dialogVisible.value = true
}

const openWriteDialog = (row : any) => {
  dialogVisible.value = true
  baseInfo.data = {...row}
  writeModel.value = true
}

const searchData = (data : any) => {
  tableData.value = tableData.value.filter(
      item => {
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
        <th>操作</th>
      </tr>
      <tr
          class="bg-white dark:bg-boxdark dark:text-white dark:hover:text-black hover:bg-slate-200 border-slate-200 transition odd:border-b odd:border-t h-10 text-center"
          v-for="(row, index) in tableData" :key="index"
      >
        <td v-for="idx in columnsHeader" :key="idx.index" class="max-w-30 truncate">
          <a v-if="idx.index === 'logNo'" class="text-primary hover:cursor-pointer" @click="openDialog(row)" > {{ row[idx.index] }} </a>
          <div v-else>{{ row[idx.index] }}</div>
        </td>
        <td>
          <a @click="openDialog(row)" class="text-meta-3 cursor-pointer mr-2 hover:font-semibold ">
            查看
          </a>
          <a class="text-primary transition hover:font-bold cursor-pointer" @click="openWriteDialog(row)">
            填写
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
        @close="cancelCommit"
    >
      <div class="grid grid-cols-4 infoBoxParent">
        <div >日志编号</div>
        <div >{{ baseInfo.data.logNo }}</div>
        <div >项目名称</div>
        <div >{{baseInfo.data.projectName}}</div>
        <div >填报人</div>
        <div>{{baseInfo.data.commuter}}</div>
        <div>填报时间</div>
        <div>{{baseInfo.data.commitTime}}</div>
        <div>日志下发时间</div>
        <div>{{baseInfo.data.releaseTime}}</div>
        <div>是否逾期</div>
        <div>{{baseInfo.data.isDelay ? '是' : '否'}}</div>
      </div>
      <div class="flex h-24 items-center">
        <div class="w-1/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8; background-color: #F6F6F6">日志内容</div>
        <div v-if="! writeModel" class="w-3/4 h-full flex justify-center items-center" style="border: 0.5px solid #E8E8E8;">{{ baseInfo.data.logContent }}</div>
        <div v-else class="w-3/4 h-full flex justify-center items-center">
          <el-input
              v-model="baseInfo.data.logContent"
              type="textarea"
              style="height: 100%"
              resize="none"
              rows="4"
          />
        </div>
      </div>
      <div v-if="writeModel" class="flex justify-end space-x-6 h-10 mt-5">
        <button class="w-18 transition hover:ring-1 ring-slate-400 hover:-translate-y-1 text-white bg-slate-400 rounded" @click="cancelCommit">
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