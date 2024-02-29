<script setup lang="ts">
import { ref } from 'vue'


const toDoItems = ref([
  { type: '涉电力问题', content: '高压杆线需迁改，需指挥部协调', name: '翔安大嶝机场大嶝中路', source: '济南地勘建设总公司', time: '2016-10-28  10:30:30'},
  { type: '涉电力问题', content: '高压杆线需迁改，需指挥部协调', name: '翔安大嶝机场大嶝中路', source: '济南地勘建设总公司', time: '2016-10-28  10:30:30'},
  { type: '涉电力问题', content: '高压杆线需迁改，需指挥部协调', name: '翔安大嶝机场大嶝中路', source: '济南地勘建设总公司', time: '2016-10-28  10:30:30'},
  { type: '涉电力问题', content: '高压杆线需迁改，需指挥部协调', name: '翔安大嶝机场大嶝中路', source: '济南地勘建设总公司', time: '2016-10-28  10:30:30'},
])
</script>

<template>
    <div class="col-span-12 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8 border-solid border-2">
        <div class="mt-1 p-2 flex items-end"> 
            <h2 class="pl-2 pt-1 text-sm font-bold text-black dark:text-white">待办事项</h2>      
        </div>
        <hr class="mt-2 border-t-2 border-black dark:border-white">

        <div class="p-2 max-h-100 overflow-y-auto"> 
            <table class="mt-4 w-full table-wrapper">
                <thead>
                    <tr class="bg-gray text-center dark:bg-meta-4">
                        <th class="text-xs py-2 px-2 font-medium text-black dark:text-white xl:pl-5">
                            问题类型
                        </th>
                        <th class="text-xs min-w-[150px] py-2 px-2 font-medium text-black dark:text-white">
                            问题内容
                        </th>
                        <th class="text-xs min-w-[100px] py-2 px-2 font-medium text-black dark:text-white">
                            项目名称
                        </th>
                        <th class="text-xs min-w-[100px] py-2 px-2 font-medium text-black dark:text-white">
                            来源
                        </th>
                        <th class="text-xs min-w-[100px] py-2 px-2 font-medium text-black dark:text-white">
                            时间
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item,index) in toDoItems" :key="index">
                        <td class="text-center py-2 px-2">
                            <p class="text-xs text-black dark:text-white">{{ item.type }}</p>
                        </td>
                        <td class="text-center py-2 px-2">
                            <p class="text-xs text-black dark:text-white">{{ item.content }}</p>
                        </td>
                        <td class="text-center py-2 px-2">
                            <p class="text-xs text-black dark:text-white">{{ item.name }}</p>
                        </td>
                        <td class="text-center py-2 px-2">
                            <p class="text-xs text-black dark:text-white">{{ item.source }}</p>
                        </td>
                        <td class="text-center py-2 px-2">
                            <p class="text-xs text-black dark:text-white">{{ item.time }}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        

    </div>
  <!-- To-Do Item Start -->
  
  <!-- Card Item End -->
</template>
