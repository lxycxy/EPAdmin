import request from "@/utils/request";

export interface DataStatsOne {
    contractCount: number
    projectCount: number
    projectProgress: number
    delayProjectCount: number
    delayLogToday: number
    newProblemToday: number
}

export const getDataOne = () => {
    return request.get('/crebas/index/getData')
}

export const getChartOne = () => {
    return request.get('/crebas/index/getProjectBuildingProcess')
}

export const getChartTwo = () => {
    return request.get('/crebas/index/getProjectBuildingPhaseRatio')
}

export const getChartThree = () => {
    return request.get('/crebas/index/getPostponedRatio')
}

export const getToDoItems = (data: string) => {
    return request.get( '/crebas/problem/searchProbByProblemState/'+ data)
}

