import request from "@/utils/request";

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
    projectId: string,
    projectName: string,
    secondcompanyManager: string,
    secondcompanyManagerPhone: string
}

export const getContractData = () => {
    return request.get('/mock/contract.json')
}