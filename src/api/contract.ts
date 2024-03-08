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
    signDate: string[],
    payPlan: Date[],
    payDate: string[],
}

export interface PayRecord {
    payId: string,
    payPlan: string,
    moneyPaid: number,
    payDate: Date,
    moneyNotpaid: number,
    contract: ContractData
}

export const getContractData = () => {
    return request.get('/crebas/contract/listAll')
}

export const getPayRecordData = () => {
    return request.get('/mock/payRecord.json')
}

export const addContract = (data : ContractData) => {
    return request.post('/crebas/contract/createContract', data)
}

export const updateContract = (data : ContractData) => {
    return request.post('/crebas/contract/updateContract', data)
}