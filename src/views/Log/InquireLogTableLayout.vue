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
    logId : '',
    projectName: '',
    isDelay: '',
  }
})

const handleReset = () => {
  searchForm.data.logId = ''
  searchForm.data.projectName = ''
  searchForm.data.isDelay = ''

  emits('clickReset')
}
</script>

<template>
  <!--    功能栏-->
  <div class="h-14 pl-2 pr-2 rounded-2xl bg-white dark:bg-boxdark grid grid-cols-4 gap-2 justify-items-center items-center shadow-slate-300 shadow-sm shadow-sky-50 ">
    <SearchInput label="日志编号" placeholder="输入内容" v-model="searchForm.data.logId"></SearchInput>
    <SearchInput label="项目名称" placeholder="输入内容" v-model="searchForm.data.projectName" ></SearchInput>
    <div>
      <span class="mr-2">是否逾期</span>
      <el-select
          style="width: 10rem"
          size="large"
          v-model="searchForm.data.isDelay"
          placeholder="请选择"
      >
        <el-option label="是" value="是" />
        <el-option label="否" value="否" />
      </el-select>
    </div>

    <div class="flex h-full ml-3 space-x-4 items-center justify-around">
      <EButton @click="$emit('clickSearch', searchForm.data)" customClass="bg-primary h-3/4 w-20">
        <SearchIcon class="w-4 h-4"></SearchIcon>
        <span class="text-white">搜索</span>
      </EButton>
      <EButton @click="handleReset" customClass="bg-meta-3 h-3/4 w-20">
        <ResetIcon class="w-4 h-4"></ResetIcon>
        <span class="text-white">重置</span>
      </EButton>
      <EButton @click="$emit('clickSearch')" customClass="bg-meta-3 h-3/4 w-20">
        <ExportIcon class="w-4 h-4"></ExportIcon>
        导出
      </EButton>
      <slot></slot>
    </div>
  </div>

</template>

<style scoped>

</style>