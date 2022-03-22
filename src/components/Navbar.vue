<template>
  <nav class="navbar navbar-expand-lg navbar-light nav_blue_gradient p-3">
    <div class="container">
      <a class="navbar-brand text-white">
        <img
            src="@/assets/logos/small_logo.png"
            alt
            width="60"
            height="34"
            class="img-thumbnail"
          />
        LIMU Scholarship
        </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
      aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">

        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <router-link to="dashboard" class="nav-link text-white">Dashboard</router-link>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle text-white small" href="#" id="navbarDropdown"
            role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ `${user.first_name} ${user.last_name}` }}
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item btn" @click.prevent="logout">Logout</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import store from '@/store';
import axios from '@/includes/axiosConfig';
import { mapGetters } from 'vuex';
import router from '@/router/index';

export default {
  name: 'Navbar',
  data() {
    return {
      user: store.state.user,
    };
  },
  computed: {
    ...mapGetters(['configGetter']),
  },
  methods: {
    async logout() {
      await axios.get('authboard/logout', this.configGetter)
        .then((res) => {
          console.log(res);
          store.dispatch('logout')
            .then(() => router.push({ name: 'login' }));
        })
        .catch((err) => console.log(err.response));
    },
  },
};
</script>
