import request from "@/utils/request";

export interface UserItemData {
    account: string
    username: string
    password: string
    userId: string
    role: string
}
export const login = (data : UserItemData) => {
    return request.post('/crebas/account/login', data);
}

export const getUserData = () => {
    return request.get('/mock/account.json')
}