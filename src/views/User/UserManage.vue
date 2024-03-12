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
import useUserStore from "@/stores/user";
import {ElMessage} from "element-plus";
import FileExportIcon from "@/components/Icons/FileExportIcon.vue";
import {exportXLSX} from "@/utils/utils";
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

let pageInfo: PaginationInfo = reactive({}) as PaginationInfo
let baseInfo: UserItemData = reactive({}) as UserItemData

const dialogVisible = ref(false);
const columnsHeader = ref([
  {
    title: '用户账号',
    index: 'account'
  },
  {
    title: '用户名称',
    index:'username'
  },
  {
    title: '用户ID',
    index: 'userId'
  },
  {
    title: '用户角色',
    index: 'role'
  }
])

const map = new Map([
    ['employee', '员工'],
    ['manager', '经理'],
    ['boss', '老板']
])

const options = ref([
  {
    label: '员工',
    value: 'employee'
  }
])

const userStore = useUserStore()
const originData = ref<UserItemData[]>([]);
const tableData = ref<UserItemData[]>([]);

if (userStore.role == 'boss') {
  options.value.push({label: '经理', value: 'manager'})
}
// 调用获取用户列表API
const getUserData = () => {
  userApi.getUserData()
      .then((resp) => {
        originData.value = resp.data.users
        computedPaginationInfo(originData.value.length)
      })
      .catch(resp => {
        console.log(resp)
      })
}

getUserData();

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

const cancelCommit = () => {
  dialogVisible.value = false;
  baseInfo = reactive({}) as UserItemData;
}

const openWriteDialog = () => {
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
  getUserData();
  pageInfo.currentPage = 1;
  tableData.value = [...originData.value]
      .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

const confirmCommit = () => {
  const data = {
    userName: baseInfo.username,
    account: baseInfo.account,
    password: baseInfo.account,
    role: baseInfo.role
  }
  userApi.register(data)
      .then((resp) => {
        if (resp.status == 'OK') {
          ElMessage({
            message: '添加用户成功,密码为用户账号',
            type: "success"
          })
          getUserData();
        } else {
          ElMessage({
            message: resp.message,
            type: 'error'
          })
        }
      })
      .catch((resp) => {
        console.log(resp)
      })

  cancelCommit();
}

const exportXLSXFile = () => {
  let fileData = [];

  for (const item of originData.value) {
    fileData.push({
      '用户编号': item.userId,
      '用户名称': item.username,
      '用户账号': item.account,
      '用户角色': map.get(item.role),
    })
  }


  exportXLSX(fileData, '用户列表');
}

const pageTitle = ref('用户管理')
</script>

<template>
  <DefaultLayout>

    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->

    <UserTableLayout @clickSearch="searchData" @clickReset="handleReset">
    </UserTableLayout>
    <div class="h-10 flex space-x-4 mt-3">
      <EButton @click="openWriteDialog" class="bg-meta-5 h-full w-20">
        <UserAddIcon class="h-4 w-4"/>
        添加
      </EButton>
      <EButton @click="exportXLSXFile" class="bg-primary h-full w-20">
        <FileExportIcon class="w-4 h-4"/>
        导出
      </EButton>
    </div>
<!--    表格-->
    <div class="w-full bg-white p-5 mt-3 rounded-lg dark:bg-black shadow-md">
      <table class="w-full mt-3 rounded-lg">
        <tr class="h-14 bg-slate-100 dark:bg-form-strokedark">
          <th v-for="item in columnsHeader" :key="item.index">{{ item.title }}</th>
        </tr>
        <tr
            class="bg-white dark:bg-boxdark dark:text-white dark:hover:text-black hover:bg-slate-100 border-slate-200 transition h-10 text-center"
            v-for="(row, index) in tableData" :key="index"
        >
<!--          根据columnsHeader和tableData动态渲染-->
          <td v-for="idx in columnsHeader" :key="idx.index" class="max-w-30 truncate">
            {{ idx.index === 'role' ? map.get(row[idx.index as keyof typeof row]): row[idx.index as keyof typeof row] }}
          </td>
        </tr>
      </table>
    </div>
    <div v-if="tableData.length === 0" class="h-48 border-t flex items-center justify-center border-slate-300 text-2xl font-bold bg-slate-200 w-full">
      暂无数据
    </div>

<!--    分页组件-->
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
        <div class="info-box">用户账号</div>
        <SearchInput class="w-full h-full" v-model="baseInfo.account"></SearchInput>
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
  </DefaultLayout>
</template>

<style scoped>

</style>