<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SearchInput from "@/components/Input/SearchInput.vue";
import {ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import PlusIcon from "@/components/Icons/PlusIcon.vue";
import DeleteIcon from "@/components/Icons/DeleteIcon.vue";

const columnsHeader = ref([
  {
    title: '姓名',
    index: 'name'
  },
  {
    title: '账号',
    index: 'account'
  },
  {
    title: '性别',
    index: 'sex'
  },
])

const tableData = ref([
  {
    name: '里斯',
    account: '123',
    sex: '男',
  },
  {
    name: '里斯1',
    account: '1233',
    sex: '男',
  },
  {
    name: '里斯2',
    account: '1234',
    sex: '男',
  }
])

const handlePageChange = (currentPage : number) => {
  console.log(currentPage);
}

</script>

<template>
  <DefaultLayout>
<!--    功能栏-->
    <div class="h-14 rounded-2xl bg-white dark:bg-boxdark flex shadow-slate-300 shadow-sm shadow-sky-50 ">
      <SearchInput label="搜索" placeholder="输入内容"></SearchInput>
    </div>
    <table class="w-full mt-5 rounded-lg">
      <tr class="h-14 bg-slate-200">
        <th v-for="item in columnsHeader" :key="item.index">{{ item.title }}</th>
        <th>操作</th>
      </tr>
      <tr class="bg-white hover:bg-slate-200 border-slate-200 transition odd:border-b odd:border-t h-10 text-center"
          v-for="(row, index) in tableData" :key="index"
      >
        <td v-for="idx in columnsHeader" :key="idx.index"> {{row[idx.index]}}</td>
        <td class="flex justify-center space-x-6 items-center h-10">
          <PlusIcon class="w-5.5 h-5.5 hover:-translate-y-1.5 transition"/>
          <DeleteIcon class="w-5.5 h-5.5 hover:-translate-y-1.5 transition"/>
        </td>
      </tr>
    </table>
    <div v-if="tableData.length === 0" class="h-48 border-t flex items-center justify-center border-slate-300 text-2xl font-bold bg-slate-200 w-full">
      暂无数据
    </div>
    <Pagination @pageChange="handlePageChange" pageCount="8" total="97"></Pagination>
  </DefaultLayout>
</template>

<style scoped>

</style>