import {defineStore} from "pinia";
import router from "@/router";

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userId: '', // 用户ID
            username: '', // 用户名称
            role: '' // 用户角色
        }
    },
    actions: {
        logout () { // 清空用户数据
            this.userId = ''
            this.username = ''
            this.role = ''
            sessionStorage.removeItem('isLogin');
            router.push({name: 'signin'}) // 跳转至登录页
        }
    },
    persist: true
})
export default useUserStore;