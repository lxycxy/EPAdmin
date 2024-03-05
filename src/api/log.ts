import request from "@/utils/request";

export interface logItemData {
    logId : string
    projectName : string
    logContent: string
    logDate: Date
    logBeyondDate: Date
    logState: string
    logSender: string
    logSignDate: Date
    isDelay: string
}
export const getLogData = () => {
    return request.get('/mock/logTable.json');
}