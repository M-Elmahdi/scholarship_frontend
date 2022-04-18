import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import ApplicantForm from '@/views/ApplicantForm.vue';
import Dashboard from '@/views/Dashboard.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import NotFound from '@/views/NotFound.vue';
import EmailVerified from '@/views/EmailVerified.vue';
import ApplicationClosed from '@/views/ApplicationClosed.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  // {
  //   path: '/signup',
  //   name: 'signup',
  //   component: Signup,
  // },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/applicant-form',
    name: 'applicantForm',
    component: ApplicantForm,
  },
  {
    path: '/email-verified',
    name: 'emailVerified',
    component: EmailVerified,
  },
  {
    path: '/admin-dashboard',
    name: 'adminDashboard',
    component: AdminDashboard,
  },
  {
    path: '/closed',
    name: 'closed',
    component: ApplicationClosed,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
