import request from "@/utils/request";
import type { ProjectData } from "./project";

export interface ContractData {
    contractCost: number,
    contractPrepaid: number,
    contractEnddate: Date,
    contractSigndate: Date,
    contractStartdate: Date,
    contractFirstcompany: string,
    contractId: string,
    contractName: string,
    contractNature: string,
    contractPay: string,
    contractSecondcompany: string,
    contractState: string,
    contractType: string,
    contractWay: string,
    firstcompanyManager: string,
    firstcompanyManagerPhone: string,
    secondcompanyManager: string,
    secondcompanyManagerPhone: string,
    project: ProjectData,
}

export interface ContractSearch {
    contractName: string,
    contractId: string,
    contractState: string,
    contractNature: string,
}

export interface PayRecordSearch {
    name: string,
    type: string,
    minCost: number,
    maxCost: number,
    firstCompany: string,
    secondCompany: string,
    status: string,
    signDate: Date[],
    payDate: Date[],
}

export interface PayRecord {
    payId: string,
    payPlan: string,
    moneyPaid: number,
    payDate: Date,
    moneyNotPaid: number,
    contract: ContractData
}

export const getContractData = () => {
    return request.get('/crebas/contract/listAll')
}
export const checkContractId = (data : string) => {
    return request.get('/crebas/contract/searchContractById/' + data)
}
export const addContract = (data : ContractData) => {
    return request.post('/crebas/contract/createContract', data)
}
export const updateContract = (data : ContractData) => {
    return request.post('/crebas/contract/updateContract', data)
}
export const searchContractData = (data : ContractSearch) => {
    return {};
}

export const getPayRecordData = () => {
    return request.get('/crebas/PayProgress/listAll')
}
export const getCompany1 = () => {
    return request.get('/crebas/contract/getAllFirstCompany')
}
export const getCompany2 = () => {
    return request.get('/crebas/contract/getAllSecondCompany');
}
export const searchPayRecordData = (data : PayRecordSearch) => {
    return request.post('/crebas/PayProgress/filterProgress', data)
}
export const checkPayRecordId = (data : string) => {
    return request.get('/crebas/PayProgress/searchPayProgressById/' + data)
}
export const addPayRecord = (data : PayRecord) => {
    return request.post('/crebas/PayProgress/createPayProgress', data)
}