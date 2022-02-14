import { createStore } from 'vuex';
import axios from '@/includes/axiosConfig';

export default createStore({
  state: {
    user: null,
    authenticated: false,
    token: localStorage.getItem('IS-token') || null,
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
      state.config.headers.Authorization = null;
      state.token = null;
      localStorage.removeItem('IS-token');
    },
  },
  actions: {
    logout({ commit }) {
      commit('setUnauthenticated');
    },
    async restoreSession({ state, commit }) {
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
            country: data.country,
            application: Object.prototype.hasOwnProperty.call(data, 'application')
              ? data.application
              : null,
          };

          commit('setAuthenticated', user);
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
  modules: {},
  getters: {
    configGetter(state) {
      return state.config;
    },
  },
});
