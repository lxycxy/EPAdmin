import request, {BASE_URL} from "@/utils/request";
import type {ProjectData} from "@/api/project";
export interface ProblemItemData {
    projectName: string
    projectId: string
    problemId : string
    problemDescription: string
    problemAdviced: string
    problemHandler: string
    problemHandleway: string
    problemSendcompany : string
    problemSender: string
    problemState: string
    problemType : string
    problemHandleDate: string
    problemSenddate: string
    project: ProjectData
}

export const getProblemData = () => {
    return request.get( '/crebas/problem/listAll')
}

export const createProblemData = (data: ProblemItemData) => {
    return request.post( '/crebas/problem/createProblem', data)
}

export const postProblemHandleResult = (data : ProblemItemData) => {
    return request.post('/crebas/problem/updateProblem', data)
}