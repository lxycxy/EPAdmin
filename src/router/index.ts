import { createRouter, createWebHistory } from 'vue-router'

import SigninView from '@/views/Authentication/SigninView.vue'
import DashboardView from '@/views/Dashboard/DashboardView.vue'
import ProjectView from '@/views/Project/ProjectView.vue'
import LedgerView from '@/views/Contract/LedgerView.vue'
import PayProgressView from '@/views/Contract/PayProgressView.vue'
import LogWriteView from '@/views/Log/LogWriteView.vue'
import LogInquireView from '@/views/Log/LogInquireView.vue'
import QuestionWriteView from '@/views/Question/QuestionWriteView.vue'
import QuestionHandleView from '@/views/Question/QuestionHandleView.vue'
import QualityView from '@/views/Quality/QualityView.vue'
import ProfileView from '@/views/User/ProfileView.vue'
import UserManageView from "@/views/User/UserManage.vue";
import useUserStore from "@/stores/user";
import NoAuthView from "@/views/Auth/NoAuthView.vue";
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      title: '首页',
      requiresAuth: true,
      roles: ['employee', 'manager', 'boss']
    }
  },
  {
    path: '/project',
    name: 'Project',
    component: ProjectView,
    meta: {
      title: '项目管理',
      requiresAuth: true,
      roles: ['manager', 'boss']
    }
  },
  {
    path: '/contract/ledger',
    name: 'Ledger',
    component: LedgerView,
    meta: {
      title: '合同管理',
      requiresAuth: true,
      roles: ['manager', 'boss']
    }
  },
  {
    path: '/contract/payprogress',
    name: 'PayProgress',
    component: PayProgressView,
    meta: {
      title: '支付进度',
      requiresAuth: true,
      roles: ['manager', 'boss']
    }
  },
  {
    path: '/log/logwrite',
    name: 'LogWrite',
    component: LogWriteView,
    meta: {
      title: '日志填报',
      requiresAuth: true,
      roles: ['employee','employee','boss']
    }
  },
  {
    path: '/log/loginquire',
    name: 'LogInquire',
    component: LogInquireView,
    meta: {
      title: '日志查询',
      requiresAuth: true,
      roles: ['manager', 'boss']
    }
  },
  {
    path: '/question/questionwrite',
    name: 'QuestionWrite',
    component: QuestionWriteView,
    meta: {
      title: '问题填报',
      requiresAuth: true,
      roles: ['employee', 'manager', 'boss']
    }
  },
  {
    path: '/question/questionhandle',
    name: 'QuestionHandle',
    component: QuestionHandleView,
    meta: {
      title: '问题处理',
      requiresAuth: true,
      roles: ['manager', 'boss']
    }
  },
  {
    path: '/quality/inspect',
    name: 'QualityInspect',
    component: QualityView,
    meta: {
      title: '质量检查',
      requiresAuth: true,
      roles: ['manager', 'boss']
    }
  },
  {
    path: '/user/manage',
    name: 'UserManage',
    component: UserManageView,
    meta: {
      title: '用户管理',
      requiresAuth: true,
      roles: ['boss']
    }
  },
  {
    path: '/user/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: '个人信息',
      requiresAuth: true,
      roles: ['employee','manager', 'boss']
    }
  },
  {
    path: '/auth/signin',
    name: 'signin',
    component: SigninView,
    meta: {
      title: '登录',
      requireAuth: false
    }
  },
  {
    path: '/auth/500',
    name: 'noAuth',
    component: NoAuthView,
    meta: {
      title: '权限不足',
      requireAuth: false
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `Ep Admin ${to.meta.title} | 项目工程管理系统`
  const isLogin = sessionStorage.getItem('isLogin');
  const userStore= useUserStore()

  if (to.meta.requiresAuth && !isLogin) {
    next({ name: 'signin' })
  } else if (! to.meta.requiresAuth) {
    next()
  } else if (isLogin && !to.meta.roles.includes(userStore.role)) {
    next({name: "noAuth"})
  } else {
    next()
  }
})

export default router