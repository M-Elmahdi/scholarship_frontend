import { createRouter, createWebHistory } from 'vue-router';
// import store from '@/store';
import Signup from '@/views/Signup.vue';
import Login from '@/views/Login.vue';
import ApplicantForm from '@/views/ApplicantForm.vue';
import Dashboard from '@/views/Dashboard.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  },
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
    path: '/admin-dashboard',
    name: 'adminDashboard',
    component: AdminDashboard,
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

// router.beforeEach(() => {
//   console.log('entered route');
// });

export default router;
