<script setup lang="ts">
import SearchInput from "@/components/Input/SearchInput.vue";
import SearchIcon from "@/components/Icons/SearchIcon.vue";
import ResetIcon from "@/components/Icons/ResetIcon.vue";
import {reactive} from "vue";
import ExportIcon from "@/components/Icons/ExportIcon.vue";
import EButton from "@/components/Buttons/EButton.vue";
const emits = defineEmits(['clickSearch', 'clickReset', 'clickExport'])

const searchForm = reactive({
  data: {
    username: '',
    userId: '',
    role: ''
  }
})

const handleReset = () => {
  searchForm.data.username = ''
  searchForm.data.userId = ''
  searchForm.data.role = ''

  emits('clickReset')
}
</script>

<template>
  <!--    功能栏-->
  <div class="h-14 rounded-2xl pl-2 pr-2 bg-white dark:bg-boxdark grid grid-cols-4 gap-2  justify-items-center items-center shadow-slate-300 shadow-sm shadow-sky-50 ">
    <SearchInput label="用户名称" placeholder="输入内容" v-model="searchForm.data.username"></SearchInput>
    <SearchInput label="用户账号" placeholder="输入内容" v-model="searchForm.data.userId" ></SearchInput>
    <div>
      <span class="mr-2">用户角色</span>
      <el-select
          style="width: 10rem"
          size="large"
          v-model="searchForm.data.role"
          placeholder="请选择"
      >
        <el-option label="员工" value='employee' />
        <el-option label="经理" value='manager' />
        <el-option label="老板" value='boss' />
      </el-select>
    </div>

    <div class="flex h-full space-x-4 items-center justify-around">
      <EButton @click="$emit('clickSearch', searchForm.data)" class="bg-primary h-3/4 w-20">
        <SearchIcon class="w-4 h-4"></SearchIcon>
        <span class="text-white">搜索</span>
      </EButton>
      <EButton @click="handleReset" class="bg-meta-3 h-3/4 w-20 ">
        <ResetIcon class="w-4 h-4"></ResetIcon>
        <span class="text-white">重置</span>
      </EButton>
      <EButton @click="$emit('clickSearch')" class="bg-meta-10 h-3/4 w-20">
        <ExportIcon class="w-4 h-4"></ExportIcon>
        导出
      </EButton>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>