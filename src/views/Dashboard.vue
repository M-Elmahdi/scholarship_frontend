<template>

  <div v-if="isAdmin">
    <admin-navbar />
  </div>

  <div v-if="isUser">
    <navbar />
  </div>

  <div v-if="isAdmin">
    <admin-dashboard />
  </div>

  <div v-if="isUser">

    <div v-if="emailVerified">
      <applicant/>
    </div>

    <div v-else>
      <verify-email />
    </div>

  </div>

</template>

<script>
import Navbar from '@/components/Navbar.vue';
import store from '@/store';
import Applicant from '@/components/applicant/Applicant.vue';
import AdminDashboard from '@/components/admin/AdminDashboard.vue';
import { mapGetters } from 'vuex';
import VerifyEmail from '@/components/applicant/VerifyEmail.vue';
import AdminNavbar from '@/components/AdminNavbar.vue';

export default {
  name: 'Dashboard',
  user: store.state.user,
  components: {
    Navbar, Applicant, VerifyEmail, AdminDashboard, AdminNavbar,
  },
  data() {
    return {
      user: store.state.user,
      emailVerified: store.state.emailVerified,
    };
  },
  computed: {
    ...mapGetters(['configGetter']),
    isAdmin() {
      return store.state.role === 'admin';
    },
    isUser() {
      return store.state.role === 'User';
    },
  },
  beforeRouteEnter(to, from, next) {
    if (store.state.authenticated) {
      next();
    } else {
      next({ name: '' });
    }
  },
};
</script>
