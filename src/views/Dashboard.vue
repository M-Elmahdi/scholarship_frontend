<template>
  <navbar />
  <applicant/>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import store from '@/store';
import Applicant from '@/components/applicant/Applicant.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
  user: store.state.user,
  components: {
    Navbar, Applicant,
  },
  data() {
    return {
      user: store.state.user,
    };
  },
  computed: {
    ...mapGetters(['configGetter']),
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
