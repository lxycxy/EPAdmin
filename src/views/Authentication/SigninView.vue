<script setup lang="ts">
import DefaultAuthCard from '@/components/Auths/DefaultAuthCard.vue'
import InputGroup from '@/components/Auths/InputGroup.vue'
import {tipMessage} from "@/utils/TipMessage";
import * as userAPI from '@/api/user'
import useUserStore from "@/stores/user";
import router from "@/router";
import {reactive} from "vue";
import type {UserItemData} from "@/api/user";
import {ElMessage} from "element-plus";
const userStore = useUserStore()

const isLogin = sessionStorage.getItem('isLogin');
if (isLogin) router.push({name : 'Dashboard'})
let loginForm:UserItemData = reactive({}) as UserItemData
const login = () => {
  userAPI.login(loginForm)
      .then((resp) => {
        if (resp.status == 'OK') {
          userStore.$patch({
            userId: resp.data.login.userId,
            username: resp.data.login.userName,
            role: resp.data.login.role,
          })
          sessionStorage.setItem('isLogin', resp.data.username);
          ElMessage({
            message: resp.message,
            type:"success"
          })
          router.push({name :'Dashboard'})
        } else {
          ElMessage({
            message: resp.message,
            type: "error"
          })
        }

  })
}
</script>

<template>
    <DefaultAuthCard subtitle="xxxx系统" title="登录">
        <InputGroup v-model="loginForm.account" label="用户账号" placeholder="输入您的用户账号">
          <svg
              width="22"
              height="22"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512">
            <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path fill="#b1b9c5" d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
          </svg>
        </InputGroup>

        <InputGroup v-model="loginForm.password" label="密码" type="password" placeholder="输入您的密码">
          <svg
            class="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <path
                d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                fill=""
              />
              <path
                d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                fill=""
              />
            </g>
          </svg>
        </InputGroup>

        <div class="mb-5 mt-6">
          <button
              @click="login"
              value="Sign In"
              class="w-full cursor-pointer hover:ring-1 ring-primary hover:-translate-y-1 rounded-lg border border-primary bg-primary p-4 font-medium text-white transition hover:font-bold"
          >
            登录
          </button>
        </div>
        <div class="mt-6 text-center">
          <p class="font-medium">
            <router-link to="/auth/signup" class="text-primary">没有账号? 点击注册</router-link>
          </p>
        </div>
    </DefaultAuthCard>
</template>
