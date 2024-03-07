import type {ProjectData} from "@/api/project";
import request from "@/utils/request";
export interface logItemData {
    logId : string
    logContent: string
    logDate: Date
    logBeyondDate: Date
    logState: string
    logSender: string
    logSignDate: Date
    isDelay: string
    projectName: string
    project: ProjectData
    projectId: string
}
export const getLogData = () => {
    return request.get('/crebas/log/getAll');
}

// 提交日志填报内容
export const commitFillLog = (data: logItemData) => {
    return request.post('/crebas/log/update', data);
}

export const createLog = (data: logItemData) => {
    return request.post('/crebas/log/create', data);
}