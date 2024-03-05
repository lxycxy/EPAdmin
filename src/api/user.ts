import request from "@/utils/request";


export const login = () => {
    return request.get('/mock/user.json')
}