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

export const getProjectData = () => {
    return request.get('/mock/project.json')
}