import request from "@/utils/request";
import type { ProjectData } from "./project";

export interface SearchConditions {
    checkId: string,
    checkDate: Date[],
    checkResult: string,
    projectId: string
}

export interface InspectRecord {
    checkId: string,
    checker: string,
    checkDate: Date,
    checkResult: string,
    project: ProjectData
}

export const getInspectData = () => {
    return request.get('/crebas/quality/listAll')
}
export const checkCheckId = (data : string) => {
    return request.get('/crebas/quality/searchQuality/' + data);
}
export const addInspectRecord = (data : InspectRecord) => {
    return request.post('/crebas/quality/createQuality', data)
}
export const searchInspectRecordData = (data : SearchConditions) => {
    return request.post('/crebas/quality/filterQualityCheck', data)
}
