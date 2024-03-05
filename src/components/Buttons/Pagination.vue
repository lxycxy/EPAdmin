<script setup lang="ts">
import {ref} from "vue";

const props = defineProps(['pageCount', 'total',])
const currentPage = ref(1)
const emits = defineEmits(['pageChange'])

const operatorPage = (delta: number) => {

  if (currentPage.value + delta < 1 || currentPage.value + delta > props.pageCount)
    return
  currentPage.value += delta;

  emits('pageChange', currentPage.value)
}
const changeCurrentPage = (index : number) => {
  currentPage.value = index;
  emits('pageChange', currentPage.value);
}
const range = (currentIndex: number) => {

  let createArr = [];
  if (props.pageCount < 6) {
    for (let i = 2; i < props.pageCount; i ++)
      createArr.push(i);
  } else {
    if (currentIndex != 1 && currentIndex != props.pageCount) createArr.push(currentIndex);

    let leftCnt = 1, rightCnt = 1;
    while (currentIndex - leftCnt >= 2 && leftCnt <= 2) createArr.push(currentIndex - leftCnt ++);
    while (currentIndex + rightCnt < props.pageCount && rightCnt <= 2) createArr.push(currentIndex + rightCnt ++);


    if (rightCnt != 3) {
      while (currentIndex - leftCnt  >= 2 && rightCnt <= 2) {
        createArr.push(currentIndex - leftCnt);
        leftCnt ++;
        rightCnt ++;
      }
    } else if (leftCnt != 3) {
      while (currentIndex + rightCnt >= 2 && currentIndex + rightCnt < props.pageCount && leftCnt <= 2) {
        createArr.push(currentIndex + rightCnt);
        rightCnt ++;
        leftCnt ++;
      }
    }

  }
  createArr.sort();
  return createArr;
}

</script>
<template>
  <div class="flex items-center justify-between border-t border-slate-200 dark:bg-form-strokedark bg-white px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <a @click="operatorPage(-1)" href="#" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">上一页</a>
      <a @click="operatorPage(1)" href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">下一页</a>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          表格共{{ props.pageCount }}页，共有{{ props.total }}条结果
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex  -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <a @click="operatorPage(-1)" class="relative hover:bg-slate-200 hover:scale-110 transform duration-200 inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-slate-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </a>

          <a @click="changeCurrentPage(1)" :class="currentPage == 1 ? 'bg-primary text-white' : ''" class="relative hover:bg-slate-200 hover:scale-110 transform duration-200 inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-slate-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="w-5 h-5 flex items-center justify-center"> 1 </span>
          </a>

          <span v-if="range(currentPage).length !== 0 && range(currentPage)[0] !== 2" class="w-10 h-5 flex items-center justify-center">...</span>

          <a
              v-for="index in range(currentPage)"
              :key="index" @click="changeCurrentPage(index)"
              :class="currentPage == index ? 'bg-primary text-white' : ''"
              class="relative hover:bg-slate-200 hover:scale-110 transform duration-200 inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-slate-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="w-5 h-5 flex items-center justify-center">{{ index }}</span>
          </a>
          <span v-if="range(currentPage).length !== 0 && range(currentPage).at(-1) != props.pageCount - 1"   class="w-10 h-5 flex items-center justify-center">...</span>

          <a v-if="pageCount > 1" @click="changeCurrentPage(props.pageCount)" :class="currentPage == props.pageCount ? 'bg-primary text-white' : ''" class="relative hover:bg-slate-200 hover:scale-110 transform duration-200 inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-slate-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="w-5 h-5 flex items-center justify-center">{{props.pageCount}}</span>
          </a>

          <a @click="operatorPage(1)" class="relative hover:bg-slate-200 hover:scale-110 transform duration-100 inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-slate-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>
