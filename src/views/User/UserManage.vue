<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {reactive, ref} from "vue";
import Pagination from "@/components/Buttons/Pagination.vue";
import type{PaginationInfo} from "@/utils/Pagination";
import * as userApi from "@/api/user";
import EButton from "@/components/Buttons/EButton.vue";
import UserTableLayout from "@/views/User/UserTableLayout.vue";
import UserAddIcon from "@/components/Icons/UserAddIcon.vue";
import type {UserItemData} from "@/api/user";
import SearchInput from "@/components/Input/SearchInput.vue";


let pageInfo: PaginationInfo = reactive({}) as PaginationInfo
let baseInfo: UserItemData = reactive({}) as UserItemData

const dialogVisible = ref(false);
const columnsHeader = ref([
  {
    title: '用户名称',
    index:'username'
  },
  {
    title: '用户账号',
    index: 'userId'
  },
  {
    title: '用户角色',
    index: 'role'
  }
])

const options = ref([
  {
    label: '员工',
    value: 'employee'
  },
  {
    label: '经理',
    value: 'manager'
  },
  {
    label: '老板',
    value: 'boss'
  },
])

const originData = ref<UserItemData[]>([]);
const tableData = ref<UserItemData[]>([]);

const getProblemData = () => {
  userApi.getUserData()
      .then((resp) => {
        originData.value = resp.data
        pageInfo.totalCount = originData.value.length;
        pageInfo.pageSize = 8;
        pageInfo.totalPages = Math.ceil(pageInfo.totalCount / pageInfo.pageSize);
        pageInfo.currentPage = 1;
        tableData.value = [...originData.value]
            .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
      })
      .catch(resp => {
        console.log(resp)
      })
}

getProblemData();

const handlePageChange = (currentPage : number) => {
  pageInfo.currentPage = currentPage;
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}


const cancelCommit = () => {
  dialogVisible.value = false;
}

const openWriteDialog = () => {

  dialogVisible.value = true
}

const openDialog = (row : any) => {
  baseInfo = reactive({...row})
  dialogVisible.value = true
}

const searchData = (data : any) => {

  tableData.value = tableData.value.filter(
      item => {
        const roleOK = data.role == '' || item.role == data.role
        const usernameOK = data.username == '' || item.username == data.username
        const userIdOk = data.userId == '' || item.userId == data.userId

        return roleOK && usernameOK && userIdOk
      }
  )


}

const handleReset = () => {
  pageInfo.currentPage = 1;
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

const commitData = () => {
  console.log(baseInfo)
}

</script>

<template>
  <DefaultLayout>
    <UserTableLayout @clickSearch="searchData" @clickReset="handleReset">
    </UserTableLayout>
    <div class="h-10 mt-3">
      <EButton @click="openWriteDialog" class="bg-meta-5 h-full w-20">
        <UserAddIcon class="h-4 w-4"/>
        添加
      </EButton>
    </div>
    <div class="w-full bg-white p-5 mt-3 rounded-lg dark:bg-black shadow-md">
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
            {{ row[idx.index as keyof typeof row] }}
          </td>
          <td>
            <a class="text-meta-5 cursor-pointer mr-2 hover:font-semibold ">
              删除
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
        @close="cancelCommit"
        title="添加用户"
        style="border-radius: 0.5rem; width: 30rem"
    >
      <div class="grid grid-cols-2 gap-2">
        <div class="info-box">用户名称</div>
        <SearchInput class="w-full h-full" v-model="baseInfo.username"></SearchInput>
        <div class="info-box">用户角色</div>
        <el-select
            v-model="baseInfo.role"
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
      </div>
      <div class="flex justify-end space-x-6 h-10 mt-5">
        <button @click="cancelCommit" class="w-18 transition hover:ring-1 ring-slate-400 hover:-translate-y-1 text-white bg-slate-400 rounded" >
          取消
        </button>
        <button @click="commitData" class="w-18 text-white transition hover:ring-1 ring-meta-3  hover:-translate-y-1 bg-meta-3 rounded">
          提交
        </button>
      </div>
    </el-dialog>
  </DefaultLayout>
</template>

<style scoped>

</style>