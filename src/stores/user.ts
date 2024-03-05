import {defineStore} from "pinia";
import router from "@/router";

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userId: '',
            username: '',
            role: ''
        }
    },
    actions: {
        logout () {
            this.userId = ''
            this.username = ''
            this.role = ''
            sessionStorage.removeItem('isLogin');
            router.push({name: 'signin'})
        }
    },
    persist: true
})
export default useUserStore;