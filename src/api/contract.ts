import request, { BASE_URL } from "@/utils/request";
import type { ProjectData } from "./project";

export interface ContractData {
    contractCost: number,
    contractPrepaid: number,
    contractEnddate: string,
    contractSigndate: string,
    contractStartdate: string,
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
    project: ProjectData,
    secondcompanyManager: string,
    secondcompanyManagerPhone: string
}

export interface SearchConditions {
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
    return request.get(BASE_URL + '/crebas/contract/listAll')
}

export const getPayRecordData = () => {
    return request.get('/mock/payRecord.json')
}