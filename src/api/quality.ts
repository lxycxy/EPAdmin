import request from "@/utils/request";

export interface SearchConditions {
    checkId: string,
    checkDate: Date[],
}

export interface InspectRecord {
    checkId: string,
    checker: string,
    checkDate: Date,
    checkResult: string,
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
