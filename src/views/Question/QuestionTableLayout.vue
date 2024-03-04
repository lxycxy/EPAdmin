<script setup lang="ts">
import SearchInput from "@/components/Input/SearchInput.vue";
import SearchIcon from "@/components/Icons/SearchIcon.vue";
import ResetIcon from "@/components/Icons/ResetIcon.vue";
import {reactive} from "vue";
import ExportIcon from "@/components/Icons/ExportIcon.vue";
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
  <div class="h-14 rounded-2xl bg-white dark:bg-boxdark flex justify-around items-center shadow-slate-300 shadow-sm shadow-sky-50 ">
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
      <button @click="$emit('clickSearch', searchForm.data)" class="bg-primary  rounded-xl hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary h-3/4 w-20 justify-around flex items-center">
        <SearchIcon class="w-4 h-4"></SearchIcon>
        <span class="text-white">搜索</span>
      </button>
      <button @click="handleReset" class="bg-meta-3 rounded-xl hover:ring-1 hover:ring-meta-3 hover:-translate-y-1 transition ring-primary h-3/4 w-20 justify-around flex items-center">
        <ResetIcon class="w-4 h-4"></ResetIcon>
        <span class="text-white">重置</span>
      </button>
      <button @click="$emit('clickSearch')" class="bg-meta-10 text-white rounded-xl hover:ring-1 hover:ring-meta-10 hover:-translate-y-1 transition ring-primary h-3/4 w-20 justify-around flex items-center">
        <ExportIcon class="w-4 h-4"></ExportIcon>
        导出
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>