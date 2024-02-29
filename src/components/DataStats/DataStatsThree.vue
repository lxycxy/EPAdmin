<script setup lang="ts">
import { ref } from 'vue'

const imageList = ref(['WD1.png', 'WD2.png', 'WD3.png']);

</script>

<template>
    <div class="col-span-12 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4 transition-all duration-500 border-solid border-2 hover:border-black dark:hover:border-white">
        <div class="mt-1 p-2 flex items-end"> 
            <h2 class="pl-2 pt-1 text-sm font-bold text-black dark:text-white">工作动态</h2>      
        </div>
        <hr class="mt-2 border-t-2 border-black dark:border-white">

        <div class="block text-center" m="t-4">
          <el-carousel trigger="click" height="200px">
            <el-carousel-item v-for="(imageName, index) in imageList" :key="index">
              <img class="carousel-image" :src="`/src/assets/images/work-dynamics/${imageName}`" alt="Work Image" />
            </el-carousel-item>
          </el-carousel>
        </div>    
    </div>
  <!-- To-Do Item Start -->
  
  <!-- Card Item End -->
</template>

<style scope>
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 图片等比例缩放并填充整个容器 */
}
</style>
