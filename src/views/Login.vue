<template>
    <div class="row my-5 rounded border m-5 shadow">
      <!-- Widget Section -->
      <div class="col blue_gradient fw-bold">
        <div class="py-5 text-white text-center">
          <h4 class="fw-bold">Apply for the Scholarship</h4>
        </div>
        <div class="text-white"><p>{{ content.overview }}</p></div>
      </div>

      <!-- Form Section -->
      <div class="bg-white col d-grid justify-content-center p-4">

        <!-- Login Form Header -->
        <img src="@/assets/logos/limu_logo.png"
        class="rounded mx-auto d-block img-fluid img-thumbnail mb-3" alt="image">

        <div class="text-center fw-bold mb-3">
          <h4 class="fw-bold">Login</h4>
        </div>

        <vee-form :validation-schema="loginSchema"
        @submit="login">
          <div class="px-5">

            <div class="mb-3">
              <!-- Email -->
              <label class="form-label small">Email address</label>
              <vee-field type="email" name="email"
               class="form-control" required></vee-field>
              <error-message class="fw-bold small text-danger text-lowercase" name="email" />
            </div>

            <div class="mb-3">
              <!-- Password -->
              <label class="form-label small">Password</label>
              <vee-field type="password" name="password"
              class="form-control" required></vee-field>
              <error-message class="fw-bold small text-danger text-lowercase" name="password" />
            </div>

            <div class="text-center">
              <button :disabled="loginLoading"
              class="btn btn-primary text-center col-md-6 mt-3">
                Login
              </button>

              <div v-if="loginLoading"
              class="spinner-border text-primary m-1" role="status">
                      <span class="visually-hidden"></span>
              </div>
            </div>
            <!-- <div class="text-center mt-2">
              <router-link to="Signup">Don't have an account? Sign-up</router-link>
            </div> -->

            <!-- Alert Messages -->
            <div v-show="loginMessage !== ''" class="mt-3 p-2 text-center"
            :class="loginMessageClass">
              {{ loginMessage }}
            </div>
          </div>
        </vee-form>
      </div>
    </div>
</template>

<script>
import content from '@/assets/widgetContent';
import { setCookie } from '@/includes/manageCookies';
// eslint-disable-next-line import/no-cycle
import store from '@/store';
import axios from '@/includes/axiosConfig';

export default {
  name: 'Login',
  data() {
    return {
      content,
      loginSchema: {
        email: 'required|email|min:8|max:50',
        password: 'required|min:8|max:100',
      },
      loginLoading: false,
      loginMessage: '',
      loginMessageClass: 'alert alert-success',
    };
  },
  methods: {
    async login(values) {
      this.loginLoading = true;

      if (values.rememberMe) {
        setCookie('userEmail', values.email, 365);
        setCookie('userPassword', values.password, 365);
      }
      const cred = {
        email: values.email,
        password: values.password,
      };

      await axios.post('authboard/login', cred)
        .then((res) => {
          const { data } = res.data;
          const role = data.roles.data[0].name;

          if (role === 'admin') {
            const user = {
              id: data.id,
              name: data.name,
              email: data.email,
              roles: data.roles.data[0].name,
              token: data.token,
            };

            this.loginLoading = false;
            this.loginMessage = 'Successfully Logged in';
            this.loginMessageClass = 'alert alert-success';
            store.commit('setAuthenticated', user);
            this.$router.push('dashboard');
          } else if (role === 'User') {
            const user = {
              id: data.id,
              first_name: data.first_name,
              middle_name: data.middle_name,
              last_name: data.last_name,
              email: data.email,
              email_verified: data.email_verified_at,
              phone_code: data.phone_code,
              phone_number: data.phone_number,
              roles: data.roles.data[0].name,
              country: data.country,
              token: data.token,
              application: Object.prototype.hasOwnProperty.call(data, 'application')
                ? data.application
                : null,
            };

            if (user.email_verified !== null) {
              store.state.emailVerified = true;
            }

            this.loginLoading = false;
            this.loginMessage = 'Sorry application submission period is closed';
            this.loginMessageClass = 'alert alert-danger';
            // store.commit('setAuthenticated', user);
            // this.$router.push('dashboard');
          } else {
            const user = {
              id: data.id,
              name: data.name,
              email: data.email,
              roles: data.roles.data[0].name,
              token: data.token,
            };

            this.loginLoading = false;
            this.loginMessage = 'Successfully Logged in';
            this.loginMessageClass = 'alert alert-success';
            store.commit('setAuthenticated', user);
            this.$router.push('dashboard');
          }
        })
        .catch(() => {
          this.loginLoading = false;
          this.loginMessage = 'An error have occurred, try again';
          this.loginMessageClass = 'alert alert-danger';
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    if (!store.state.authenticated) {
      next();
    } else {
      next({ name: 'dashboard' });
    }
  },
};
</script>
