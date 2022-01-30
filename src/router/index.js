import { createRouter, createWebHistory } from 'vue-router';
import Signup from '@/views/Signup.vue';
import Login from '@/views/Login.vue';
import ApplicantForm from '@/views/ApplicantForm.vue';
import Dashboard from '@/views/Dashboard.vue';

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
