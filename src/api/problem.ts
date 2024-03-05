import request from "@/utils/request";
export interface ProblemItemData {
    projectName: string
    problemId : string
    problemDescription: string
    problemAdviced: string
    problemHandler: string
    problemHandleWay: string
    problemSendCompany : string
    problemSender: string
    problemState: string
    problemType : string
    problemHandleDate: string
    problemSendDate: string
}

export const getProblemData = () => {
    return request.get('/mock/problem.json')
}