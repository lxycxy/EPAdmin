<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SearchInput from "@/components/Input/SearchInput1.vue"
import Pagination from "@/components/Buttons/Pagination.vue"
import type { PaginationInfo } from "@/utils/Pagination";
import type { SearchConditions, ProjectData } from "@/api/project"
import * as projectApi from "@/api/project"
import { exportXLSX } from "@/utils/utils";
import * as XLSX from 'xlsx/xlsx.mjs';

let searchConditions: SearchConditions = reactive({}) as SearchConditions

const originData = ref<ProjectData[]>([])
const tableData = ref<ProjectData[]>([])
let detailData: ProjectData = reactive({}) as ProjectData

let pageInfo: PaginationInfo = reactive({}) as PaginationInfo

const currentPhaseOptions = [
  {
    value: '方案设计',
    label: '方案设计',
  },
  {
    value: '基层处理',
    label: '基层处理',
  },
  {
    value: '面层处理',
    label: '面层处理',
  },
  {
    value: '深层处理',
    label: '深层处理',
  },
  {
    value: '项目验收',
    label: '项目验收',
  },
  {
    value: '项目收尾',
    label: '项目收尾',
  },
]
const stateOptions = [
  {
    value: '未开始',
    label: '未开始',
  },
  {
    value: '进行中',
    label: '进行中',
  },
  {
    value: '已延期',
    label: '已延期',
  },
  {
    value: '已竣工',
    label: '已竣工',
  }
]
const placeOp = ref([])
const getPlaceOp = () => {
  projectApi.getProjectPlace()
    .then(resp => {
      placeOp.value = resp.data.projects
    })
}

const searchData = () => {

  projectApi.searchProjectData(searchConditions)
    .then(resp => {
      originData.value = resp.data.updatedProject

      pageInfo.totalCount = originData.value.length;
      pageInfo.pageSize = 6;
      pageInfo.totalPages = Math.ceil(pageInfo.totalCount / pageInfo.pageSize);
      pageInfo.currentPage = 1;
      tableData.value = [...originData.value]
        .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
    })
}
const resetSearch = () => {
  searchConditions = reactive({}) as SearchConditions;
  getProjectData();
}

const getProjectData = () => {
  getPlaceOp();
  projectApi.getProjectData()
    .then(resp => {
      originData.value = resp.data.projects

      pageInfo.totalCount = originData.value.length;
      pageInfo.pageSize = 6;
      pageInfo.totalPages = Math.ceil(pageInfo.totalCount / pageInfo.pageSize);
      pageInfo.currentPage = 1;
      tableData.value = [...originData.value]
        .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
    })
    .catch(resp => {
      console.log(resp)
    })
}
getProjectData();

const handlePageChange = (currentPage: number) => {
  pageInfo.currentPage = currentPage;
  tableData.value = [...originData.value]
    .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

const addDialogVisible = ref(false)
let flag = ref() /* 判断addDialog窗口标题 */
const addProjectDialog = () => {
  flag.value = true;
  addDialogVisible.value = true;
}
const editProjectDialog = (item: ProjectData) => {
  flag.value = false;
  addDialogVisible.value = true;
  detailData = reactive({ ...item });

}
const closeAddProjectDialog = () => {
  addDialogVisible.value = false;
  detailData = reactive({}) as ProjectData
  const fileInput = document.getElementById('fileInput') as HTMLInputElement
  fileInput.value = '';
}

const detailDialogVisible = ref(false);
const showDetail = (item: ProjectData) => {
  detailDialogVisible.value = true;
  detailData = reactive({ ...item })
}

/* 添加项目 */
const addProject = () => {
  if (detailData.projectId == undefined || detailData.projectName == undefined ||
    detailData.projectCurrentPhase == undefined || detailData.projectState == undefined ||
    detailData.projectCost == undefined || detailData.projectProgress == undefined ||
    detailData.projectPlace == undefined || detailData.projectManager == undefined ||
    detailData.projectDescription == undefined || detailData.projectPlanStarttime == undefined ||
    detailData.projectPlanFinishtime == undefined ||
    detailData.projectId == '' || detailData.projectName == '' ||
    detailData.projectCost == '' || detailData.projectProgress == '' ||
    detailData.projectPlace == '' || detailData.projectManager == '' ||
    detailData.projectDescription == ''
  ) {
    ElMessage({
      type: 'warning',
      message: '请填写必填信息',
    })
  }
  else {
    ElMessageBox.confirm(
      '是否要添加一个新的项目?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
      .then(() => {
        projectApi.checkProjectId(detailData.projectId)
          .then(resp => {
            if (resp.data.projects.projectId != null) {
              ElMessage({
                type: 'error',
                message: '项目编号已存在，请重新填写项目编号',
              })
            }
            else {
              projectApi.addProject(detailData)
                .then(() => {
                  const fileInput = document.getElementById('fileInput') as HTMLInputElement
                  if (fileInput.files && fileInput.files.length > 0) {
                    let formData = new FormData()
                    for (let i = 0; i < fileInput.files.length; i++) {
                      formData.append('files', fileInput.files[i]);
                    }
                    formData.append('projectId', detailData.projectId); // 附加项目ID到formData中

                    projectApi.uploadFiles(formData)
                      .then(() => {
                        ElMessage({
                          type: 'success',
                          message: '添加成功',
                        })
                        getProjectData();
                        closeAddProjectDialog();
                      })
                  }
                  else {
                    ElMessage({
                      type: 'success',
                      message: '添加成功',
                    })
                    getProjectData();
                    closeAddProjectDialog();
                  }
                })
            }
          })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '撤销添加',
        })
      })
  }
}
/* 修改项目 */
const editProject = () => {
  if (detailData.projectName == "" ||
    detailData.projectCost === "" || detailData.projectProgress == "" ||
    detailData.projectPlace == "" || detailData.projectManager == "" ||
    detailData.projectDescription == ""
  ) {
    ElMessage({
      type: 'warning',
      message: '请填写必填信息',
    })
  }
  else {
    ElMessageBox.confirm(
      '是否要修改一个已有项目?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
      .then(() => {
        projectApi.updateProject(detailData)
          .then(() => {
            const fileInput = document.getElementById('fileInput') as HTMLInputElement
            if (fileInput.files && fileInput.files.length > 0) {
              let formData = new FormData()
              for (let i = 0; i < fileInput.files.length; i++) {
                formData.append('files', fileInput.files[i]);
              }
              formData.append('projectId', detailData.projectId); // 附加项目ID到formData中

              projectApi.uploadFiles(formData)
                .then(() => {
                  ElMessage({
                    type: 'success',
                    message: '修改成功',
                  })
                  getProjectData();
                  closeAddProjectDialog();
                })
            }
            else {
              ElMessage({
                type: 'success',
                message: '修改成功',
              })
              getProjectData();
              closeAddProjectDialog();
            }
          })
          .catch(() => {
            ElMessage({
              type: 'error',
              message: '修改失败',
            })
          })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '撤销修改',
        })
      })
  }
}
/* 编辑项目dialog */
const confirmButton = () => {
  if (flag.value) addProject()
  else editProject()
}

const exportXLSXFile = () => {
  let fileData = [];
  for (const item of originData.value) {
    fileData.push({
      '项目编号': item.projectId,
      '项目名称': item.projectName,
      '项目所在地': item.projectPlace,
      '项目金额': item.projectCost,
      '状态': item.projectState,
      '当前阶段': item.projectCurrentPhase,
      '项目进度': item.projectProgress,
      '计划开工时间': item.projectPlanStarttime,
      '实际开工时间': item.projectRealStarttime,
      '计划完工时间': item.projectPlanFinishtime,
      '实际完工时间': item.projectRealFinishtime,
      '项目负责人': item.projectManager,
      '负责人联系电话': item.managerPhone,
      '项目概况': item.projectDescription
    })
  }
  exportXLSX(fileData, '项目');
}

// 导入excel方法
const handleFileChange = (event: any) => {
  // 获取选择的文件
  let input = event.raw;
  // 判断文件是否存在
  if (!input) return;
  // 判断文件是否为 Excel 类型
  const allowedTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  if (!allowedTypes.includes(input.type)) {
    alert("请选择 Excel 文件");
    return;
  }
  // 创建一个 FileReader 对象，用于读取文件内容
  const reader = new FileReader();
  // 定义一个回调函数，当文件读取完成后执行
  reader.onload = e => {
    if (e.target != null) {
      // 获取文件的二进制数据
      const data = e.target.result;
      // 使用 XLSX 库解析文件数据，得到一个工作簿对象
      const workbook = XLSX.read(data, { type: "binary" });
      // 获取工作簿中的第一个工作表
      console.log(workbook);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // 将工作表转换为 JSON 数组
      const json = XLSX.utils.sheet_to_json(worksheet);
      console.log(json);

      // 将 JSON 数组赋值给 tableData，用于显示在表格中
      projectApi.importFiles(json)
        .then(resp => {
          ElMessage({
            type: 'success',
            message: resp,
          })
          getProjectData();
        })
    }
  };
  // 以二进制格式读取文件
  reader.readAsBinaryString(input);
};

const download = () => {
  fetch(`http://localhost:8080/crebas/appendix/downloadZIP/${detailData.projectId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('网络错误');
      }
      return response.blob();
    })
    .then(blob => {
      // 创建一个链接元素
      const link = document.createElement('a');
      // 创建一个DOMString表示blob对象所包含数据的URL
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = `${detailData.projectId}-appendix_files.zip`;
      // 触发下载
      link.click();
      // 清理
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('错误:', error);
    });
}


const pageTitle = ref('项目库')
</script>

<template>
  <DefaultLayout>
    <!-- 填写项目对话框 -->
    <el-dialog v-model="addDialogVisible" :title="flag ? '新建项目' : '修改项目'" width="800" align-center class="p-10"
      @close="closeAddProjectDialog()">
      <div class="rounded-lg px-6">
        <p>基本信息</p>

        <!-- 填报内容 -->
        <div class="grid grid-cols-12 mt-5">
          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">项目名称</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              v-model="detailData.projectName" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">项目编号</span>
          </div>
          <div v-if="flag" class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              v-model="detailData.projectId" />
          </div>
          <div v-else class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectId }}</span>
          </div>


          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">当前阶段</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="detailData.projectCurrentPhase" class="w-full text-xs" placeholder="" size="small">
              <el-option v-for="item in currentPhaseOptions" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">项目状态</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="detailData.projectState" class="w-full text-xs" placeholder="" size="small">
              <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">项目金额(万元)</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="number"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              v-model="detailData.projectCost" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">项目进度(%)</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="number"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              v-model="detailData.projectProgress" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">项目所在地</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              v-model="detailData.projectPlace" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">计划开工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="detailData.projectPlanStarttime" type="date" placeholder="" size="small" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">计划完工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="detailData.projectPlanFinishtime" type="date" placeholder="" size="small" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">实际开工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="detailData.projectRealStarttime" type="date" placeholder="" size="small" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">实际完工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="detailData.projectRealFinishtime" type="date" placeholder="" size="small" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">附件</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input class="text-xs " type="file" id="fileInput" name="fileInput" accept=".pdf, .doc, .docx" multiple />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">项目负责人</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              v-model="detailData.projectManager" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">联系电话</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              v-model="detailData.managerPhone" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-20 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">项目概述</span>
          </div>
          <div class="col-span-10 flex items-center h-20 px-2 border border-slate-300">
            <el-input v-model="detailData.projectDescription" resize="none" type="textarea" placeholder=""
              maxlength="200" show-word-limit />
          </div>

          <div class="col-start-11 col-end-11">
            <button @click="confirmButton()"
              class="flex justify-around items-center bg-primary text-white rounded-lg w-14 p-1.5 text-xs ml-auto mt-5 mb-2 hover:bg-opacity-50">
              确定
            </button>
          </div>
          <div class="col-start-12 col-end-12">
            <button
              class="flex justify-around items-center bg-white text-black border rounded-lg w-14 p-1.5 text-xs ml-auto mt-5 mb-2 hover:bg-gray"
              @click="closeAddProjectDialog()">
              取消
            </button>
          </div>

        </div>
      </div>

    </el-dialog>

    <!-- 项目信息查看对话框 -->
    <el-dialog v-model="detailDialogVisible" title="项目详情" width="800" align-center class="p-10">
      <div class="rounded-lg px-6 mb-5">
        <p>基本信息</p>

        <!-- 项目内容 -->
        <div class="grid grid-cols-12 mt-5">
          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目名称</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectName }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目编号</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectId }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">当前阶段</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectCurrentPhase }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目状态</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectState }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目金额(万元)</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectCost }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目进度(%)</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectProgress }}</span><span>%</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目所在地</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectPlace }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">计划开工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectPlanStarttime }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">计划完工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectPlanFinishtime }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">实际开工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectRealStarttime }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">实际完工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectRealFinishtime }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">附件</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <button @click="download()"
              class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:bg-opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-white">
                <path d="M11 16h2V7h3l-4-5-4 5h3z">
                </path>
                <path
                  d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z">
                </path>
              </svg>
              下载
            </button>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目负责人</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectManager }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">联系电话</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.managerPhone }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-20 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目概况</span>
          </div>
          <div class="col-span-10 flex items-center h-20 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectDescription }}</span>
          </div>
        </div>
      </div>
    </el-dialog>

    <div class="mx-auto max-w-400">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->

      <!-- 搜索框 -->
      <div class="rounded-2xl bg-white dark:bg-boxdark flex items-center flex-wrap">
        <SearchInput class="text-xs max-w-100" label="项目名称" placeholder="输入项目名称" v-model="searchConditions.projectName">
        </SearchInput>

        <div class="flex items-center">
          <p class="text-xs ml-3">项目状态</p>
          <el-select v-model="searchConditions.projectState" class="m-2 max-w-100" placeholder="" style="width: 150px">
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <div class="flex items-center">
          <p class="text-xs ml-3">当前阶段</p>
          <el-select v-model="searchConditions.projectCurrentPhase" class="m-2 max-w-60" placeholder=""
            style="width: 150px">
            <el-option v-for="item in currentPhaseOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <div class="flex items-center">
          <p class="text-xs ml-3">所在区域</p>
          <el-select v-model="searchConditions.projectPlace" class="m-2 max-w-60" placeholder="" style="width: 150px">
            <el-option v-for="item in placeOp" :key="item" :label="item" :value="item" />
          </el-select>
        </div>

        <button @click="searchData()"
          class="flex justify-around items-center bg-primary text-white rounded-lg w-15 p-1.5 text-xs ml-auto m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
            <path fill="#ffffff"
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
          查询
        </button>

        <button @click="resetSearch()"
          class="flex justify-around justify-end items-center bg-meta-3 text-white rounded-lg w-15 p-1.5 text-xs m-2 hover:ring-1 hover:ring-meta-3 hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20" width="20">
            <path fill="#ffffff"
              d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z" />
          </svg>
          重置
        </button>
      </div>


      <!-- 操作区 -->
      <div class="flex items-center flex-wrap mt-2">
        <button @click="addProjectDialog()"
          class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 448 512">
            <path fill="#ffffff"
              d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>
          新增
        </button>

        <el-upload class="upload" :on-change="handleFileChange" :show-file-list="false" :auto-upload="false">
          <button
            class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-white">
              <path d="m12 18 4-5h-3V2h-2v11H8z">
              </path>
              <path
                d="M19 9h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2z">
              </path>
            </svg>
            导入
          </button>
        </el-upload>


        <button @click="exportXLSXFile()"
          class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-white">
            <path d="M11 16h2V7h3l-4-5-4 5h3z">
            </path>
            <path
              d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z">
            </path>
          </svg>
          导出
        </button>

      </div>

      <div class="max-h-400 overflow-y-auto">
        <!-- 表格 -->
        <table class="mt-2 w-full table-wrapper rounded-lg">
          <!-- 表头 -->
          <thead>
            <tr class="bg-slate-300 text-center dark:bg-meta-4">
              <th class="text-xs min-w-[50px] py-1 px-2 font-medium text-black dark:text-white">
                序号
              </th>
              <th class="text-xs min-w-[200px] py-1 px-2 font-medium text-black dark:text-white">
                项目名称
              </th>
              <th class="text-xs font-normal min-w-[100px] py-1 px-2 font-medium text-black dark:text-white">
                项目金额(万元)
              </th>
              <th class="text-xs min-w-[100px] py-2 px-2 font-medium text-black dark:text-white">
                状态
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                当前阶段
              </th>
              <th class="text-xs min-w-[70px] py-3 px-2 font-medium text-black dark:text-white">
                进度预警
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                项目进度
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                项目所在地
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                计划开工时间
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                实际开工时间
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                操作
              </th>
            </tr>
          </thead>

          <!-- 表格内容 -->
          <tbody>
            <tr class="bg-white dark:bg-slate-300 items-center" v-for="(item, index) in tableData" :key="index">
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ (pageInfo.currentPage - 1) * 6 + index + 1 }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-primary hover:underline cursor-pointer" @click="showDetail(item)">
                  {{ item.projectName }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.projectCost }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.projectState }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.projectCurrentPhase }}</p>
              </td>
              <td class="flex justify-center items-center text-center py-2 px-2">
                <div v-if="item.warning === 0" class="rounded-full bg-green-500 w-8 h-8" style="transform: scale(0.8);">
                </div>
                <div v-if="item.warning === 1" class="rounded-full bg-yellow-300 w-8 h-8"
                  style="transform: scale(0.8);"></div>
                <div v-if="item.warning === 2" class="rounded-full bg-red w-8 h-8" style="transform: scale(0.8);"></div>
              </td>
              <td class="text-center py-2 px-2">
                <el-progress :text-inside="true" :stroke-width="18" :percentage="item.projectProgress" />
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.projectPlace }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.projectPlanStarttime }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.projectRealStarttime }}</p>
              </td>
              <td class="flex-between text-center py-2 px-2">
                <span class="text-xs text-primary underline cursor-pointer" @click="editProjectDialog(item)"> 编辑 </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 无数据显示 -->
      <div v-if="tableData.length === 0"
        class="h-48 border-t flex items-center justify-center border-slate-300 text-2xl font-bold bg-slate-200 w-full">
        暂无数据
      </div>

      <!-- 分页 -->
      <Pagination @pageChange="handlePageChange" :pageCount="pageInfo.totalPages" :total="pageInfo.totalCount"
        :currentPage="pageInfo.currentPage"></Pagination>
    </div>
  </DefaultLayout>

</template>

<style scoped></style>