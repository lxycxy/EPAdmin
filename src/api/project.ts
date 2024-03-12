import request from "@/utils/request";

export interface ProjectData {
  projectCost: number;
  projectPlanFinishtime: Date;
  projectPlanStarttime: Date;
  projectRealFinishtime: Date;
  projectRealStarttime: Date;
  managerPhone: string;
  projectCurrentPhase: string;
  projectDescription: string;
  projectId: string;
  projectManager: string;
  projectName: string;
  projectPlace: string;
  projectProgress: number;
  projectState: string;
  warning: number;
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
  return request.get('/crebas/project/listAllPlace')
}

export const checkProjectId = (data : string) => {
  return request.get('crebas/project/search/' + data)
}

export const addProject = (data: ProjectData) => {
  return request.post('/crebas/project/create', data)
}

export const updateProject = (data: ProjectData) => {
  return request.post('/crebas/project/update', data)
}

export const searchProjectData = (data : SearchConditions) => {
  return request.post('/crebas/project/filterProject', data)
}

export const uploadFiles = (data : FormData) => {
  return request.post('/crebas/appendix/upload', data)
}

export const downloadFiles = (data : string) => {
  return request.get('/crebas/appendix/downloadZIP/' + data)
}
export const importFiles = (data : any) => {
  return request.post('/crebas/project/importExcel', data);
}