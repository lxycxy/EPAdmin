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
