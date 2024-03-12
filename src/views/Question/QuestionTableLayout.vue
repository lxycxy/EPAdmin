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
    projectName: '',
    status: '',
    questionType: ''
  }
})

const handleReset = () => {
  searchForm.data.projectName = ''
  searchForm.data.status = ''
  searchForm.data.questionType = ''

  emits('clickReset')
}
</script>

<template>
  <!--    功能栏-->
  <div class="h-14 pl-2 pr-2 rounded-2xl bg-white dark:bg-boxdark grid-cols-4 grid gap-2  justify-items-center items-center shadow-slate-300 shadow-sm shadow-sky-50 ">
    <SearchInput label="项目名称" placeholder="输入内容" v-model="searchForm.data.projectName"></SearchInput>
    <SearchInput label="问题类型" placeholder="输入内容" v-model="searchForm.data.questionType" ></SearchInput>
    <div>
      <span class="mr-2">状态</span>
      <el-select
          style="width: 10rem"
          size="large"
          v-model="searchForm.data.status"
          placeholder="请选择"
      >
        <el-option label="待处理" value='待处理' />
        <el-option label="处理中" value=处理中 />
        <el-option label="已关闭" value=已关闭 />
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
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>