<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SearchInput from "@/components/Input/SearchInput.vue";
import {ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";

const tableTitle = ref('表格标题')
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
  }
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

<!--    表格-->
    <div class="bg-white mt-5 p-5 rounded-xl shadow-sm dark:bg-boxdark">
<!--      标题-->
      <div class="text-2xl mb-3 text-black dark:text-white font-bold"> {{ tableTitle }}</div>
<!--      表头-->
      <div class="bg-slate-100 dark:bg-form-strokedark dark:text-white flex justify-around items-center h-12">
          <div class="text-md font-semibold" v-for="item in columnsHeader"> {{ item.title }}</div>
      </div>
<!--      主体-->
      <div v-if="tableData.length === 0" class="text-4xl flex items-center justify-center h-80">
        暂无数据
      </div>
      <div v-else class="flex justify-around items-center even:border-t even:border-b border-slate-300 h-14 hover:bg-slate-100 hover:font-semibold transition duration-300" v-for="item in tableData">
        <div class="text-black" v-for="idx in columnsHeader">
          {{ item[idx.index] }}
        </div>
      </div>
<!--      分页-->
      <Pagination @pageChange="handlePageChange" pageCount="10" total="97"></Pagination>
    </div>

  </DefaultLayout>
</template>

<style scoped>

</style>