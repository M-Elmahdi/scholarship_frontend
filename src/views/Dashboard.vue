<template>
  <navbar />

  <div v-if="isAdmin">
    <admin-dashboard />
  </div>

  <div v-else>

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

export default {
  name: 'Dashboard',
  user: store.state.user,
  components: {
    Navbar, Applicant, VerifyEmail, AdminDashboard,
  },
  data() {
    return {
      user: store.state.user,
      emailVerified: store.state.emailVerified,
    };
  },
  computed: {
    ...mapGetters(['configGetter']),
    isAdmin: () => store.state.role === 'admin',
    isUser: () => store.state.role === 'User',
  },
  created() {
    console.log(store.state.user);
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
