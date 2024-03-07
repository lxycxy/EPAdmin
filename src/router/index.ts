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
import AlertsView from '@/views/UiElements/AlertsView.vue'
import ButtonsView from '@/views/UiElements/ButtonsView.vue'
import UserManageView from "@/views/User/UserManage.vue";

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      title: 'Dashboard'
    }
  },
  {
    path: '/project',
    name: 'Project',
    component: ProjectView,
    meta: {
      title: 'Project'
    }
  },
  {
    path: '/contract/ledger',
    name: 'Ledger',
    component: LedgerView,
    meta: {
      title: 'Ledger'
    }
  },
  {
    path: '/contract/payprogress',
    name: 'PayProgress',
    component: PayProgressView,
    meta: {
      title: 'PayProgress'
    }
  },
  {
    path: '/log/logwrite',
    name: 'LogWrite',
    component: LogWriteView,
    meta: {
      title: 'LogWrite'
    }
  },
  {
    path: '/log/loginquire',
    name: 'LogInquire',
    component: LogInquireView,
    meta: {
      title: 'LogInquire'
    }
  },
  {
    path: '/question/questionwrite',
    name: 'QuestionWrite',
    component: QuestionWriteView,
    meta: {
      title: 'QuestionWrite'
    }
  },
  {
    path: '/question/questionhandle',
    name: 'QuestionHandle',
    component: QuestionHandleView,
    meta: {
      title: 'QuestionHandle'
    }
  },
  {
    path: '/quality/inspect',
    name: 'QualityInspect',
    component: QualityView,
    meta: {
      title: 'QualityInspect'
    }
  },
  {
    path: '/user/manage',
    name: 'UserManage',
    component: UserManageView,
    meta: {
      title: 'UserManage'
    }
  },
  {
    path: '/user/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'Profile'
    }
  },
  {
    path: '/ui-elements/alerts',
    name: 'alerts',
    component: AlertsView,
    meta: {
      title: 'Alerts'
    }
  },
  {
    path: '/ui-elements/buttons',
    name: 'buttons',
    component: ButtonsView,
    meta: {
      title: 'Buttons'
    }
  },
  {
    path: '/auth/signin',
    name: 'signin',
    component: SigninView,
    meta: {
      title: 'Signin'
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

  if (isLogin) {
    next()
  } else {
    if (to.path === '/auth/signin') {
      next()
    } else {
      next('/auth/signin')
    }
  }
})

export default router