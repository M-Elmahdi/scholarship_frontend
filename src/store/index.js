import { createStore } from 'vuex';
import axios from '@/includes/axiosConfig';

export default createStore({
  state: {
    user: null,
    authenticated: false,
    emailVerified: false,
    token: localStorage.getItem('IS-token') || null,
    role: localStorage.getItem('role') || null,
    config: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('IS-token')}`,
      },
    },
  },
  mutations: {
    setAuthenticated(state, data) {
      state.user = data;
      state.authenticated = true;

      if (Object.prototype.hasOwnProperty.call(data, 'token')) {
        console.log(`inside token condition: ${data.token}`);
        localStorage.setItem('IS-token', data.token);
        state.config.headers.Authorization = `Bearer ${localStorage.getItem('IS-token')}`;
        state.token = `Bearer ${data.token}`;
      }
    },
    setUnauthenticated(state) {
      state.user = null;
      state.authenticated = false;
      state.emailVerified = false;
      state.config.headers.Authorization = null;
      state.token = null;
      localStorage.removeItem('IS-token');
      localStorage.removeItem('role');
    },
  },
  actions: {
    logout({ commit }) {
      commit('setUnauthenticated');
    },
    async restoreSession({ state, commit }) {
      if (state.role === 'admin') {
        await axios.get('adminboard/userinfo', state.config)
          .then((res) => {
            const { data } = res.data;
            const user = {
              id: data.id,
              name: data.name,
              email: data.email,
              roles: data.roles.data[0].name,
            };

            commit('setAuthenticated', user);
          });
      } else {
        await axios.get('applicantboard/userinfo', state.config)
          .then((res) => {
            const { data } = res.data;
            const user = {
              id: data.id,
              first_name: data.first_name,
              middle_name: data.middle_name,
              last_name: data.last_name,
              email: data.email,
              roles: data.roles.data[0].name,
              phone_code: data.phone_code,
              phone_number: data.phone_number,
              email_verified: data.email_verified_at,
              country: data.country,
              application: Object.prototype.hasOwnProperty.call(data, 'application')
                ? data.application
                : null,
            };

            if (user.email_verified !== null) {
              state.emailVerified = true;
            }

            commit('setAuthenticated', user);
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    },
  },
  modules: {},
  getters: {
    configGetter(state) {
      return state.config;
    },
  },
});
