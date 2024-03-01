<script setup lang="ts">
import SearchInput from "@/components/Input/SearchInput.vue";
import SearchIcon from "@/components/Icons/SearchIcon.vue";
import ResetIcon from "@/components/Icons/ResetIcon.vue";
import {reactive} from "vue";
const emits = defineEmits(['clickSearch', 'clickReset'])

const searchForm = reactive({
  data: {
    logNo : '',
    projectName: '',
    isDelay: '',
  }
})

const handleReset = () => {
  searchForm.data.logNo = ''
  searchForm.data.projectName = ''
  searchForm.data.isDelay = ''

  emits('clickReset')
}
</script>

<template>
  <!--    功能栏-->
  <div class="h-14 rounded-2xl bg-white dark:bg-boxdark flex justify-around items-center shadow-slate-300 shadow-sm shadow-sky-50 ">
    <SearchInput label="日志编号" placeholder="输入内容" v-model="searchForm.data.logNo"></SearchInput>
    <SearchInput label="项目名称" placeholder="输入内容" v-model="searchForm.data.projectName" ></SearchInput>
    <div>
      <span class="mr-2">是否逾期</span>
      <el-select
          style="width: 10rem"
          size="large"
          v-model="searchForm.data.isDelay"
          placeholder="请选择"
      >
        <el-option label="是" value=true />
        <el-option label="否" value=false />
      </el-select>
    </div>

    <div class="flex h-full space-x-4 items-center justify-around">
      <button @click="$emit('clickSearch', searchForm.data)" class="bg-primary  rounded-xl hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary h-3/4 w-22 justify-around flex items-center">
        <SearchIcon class="w-4 h-4"></SearchIcon>
        <span class="text-white">搜索</span>
      </button>
      <button @click="handleReset" class="bg-meta-3 rounded-xl hover:ring-1 hover:ring-meta-3 hover:-translate-y-1 transition ring-primary h-3/4 w-22 justify-around flex items-center">
        <ResetIcon class="w-4 h-4"></ResetIcon>
        <span class="text-white">重置</span>
      </button>
    </div>
  </div>
  <slot></slot>
</template>

<style scoped>

</style>