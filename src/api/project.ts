import request from "@/utils/request";

export interface ProjectData {
  projectCost: number;
  projectPlanFinishtime: string;
  projectPlanStarttime: string;
  projectRealFinishtime: string;
  projectRealStarttime: string;
  managerPhone: string;
  projectCurrentPhase: string;
  projectDescription: string;
  projectId: string;
  projectManager: string;
  projectName: string;
  projectPlace: string;
  projectProgress: number;
  projectState: string;
  warming: number;
}

export interface SearchConditions {
  projectName: string,
  projectState: string,
  projectCurrentPhase: string,
  projectPlace: string
}

export const getProjectData = () => {
  return request.get('/crebas/project/listAll')
}

export const getProjectPlace = () => {
  
}