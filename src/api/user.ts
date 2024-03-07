import request from "@/utils/request";
import axios from "axios";

export interface UserItemData {
    username: string
    userId: string
    role: string
}
export const login = () => {
    return axios({
        method: 'get',
        url: '/mock/user.json'
    })
}

export const getUserData = () => {
    return request.get('/mock/account.json')
}