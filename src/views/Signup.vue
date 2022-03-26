<template>

    <div class="container">

        <!-- Wrapper -->
        <div class="row d-flex justify-content-center p-3 border rounded bg-white mt-4">
            <img src="@/assets/logos/limu_logo.png" class="img-fluid w-75">
        </div>

        <!-- Start Form -->
        <div class="bg-white m-auto mb-5 mt-2 p-3 pb-3 rounded shadow">
            <vee-form :validation-schema="schema" :initial-values="initialValues"
            @submit="signup">
                <div class="row">
                    <!-- Header -->
                    <div class="mb-3">
                        <h2 class="text-center">Signup to apply for a Scholarship</h2>
                        <hr>
                    </div>

                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">First Name</label>
                            <vee-field type="text" name="first_name"
                            class="form-control" placeholder="Fullname" />
                            <error-message class="text-danger small" name="first_name" />
                        </div>
                    </div>

                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Middle Name</label>
                            <vee-field type="text" name="middle_name"
                            class="form-control" placeholder="Middle Name" />
                            <error-message class="text-danger small" name="middle_name"/>
                        </div>
                    </div>

                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Last Name</label>
                            <vee-field type="text" name="last_name"
                            class="form-control" placeholder="Last Name" />
                            <error-message class="text-danger small" name="last_name"/>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">
                                Email
                            </label>
                            <vee-field type="email" name="email"
                            class="form-control" placeholder="Email" />
                            <error-message class="text-danger small" name="email"/>
                        </div>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-4">
                        <label class="form-label">
                            Age
                        </label>

                        <vee-field type="number" name="age" class="form-control"></vee-field>

                        <error-message class="text-danger small" name="age" />
                    </div>
                    <div class="col">
                        <label class="form-label">
                            Nationality
                        </label>

                        <div :class="countriesLoading ? 'col' : ''">
                            <vee-field as="select" name="location_id" :disabled="countriesLoading"
                            class="form-select" >
                                <option v-for="country in countries"
                                :value="country.id" :key="country.id">
                                    {{ `${country.name}` }}
                                </option>
                            </vee-field>
                        </div>

                        <div v-show="countriesLoading" class="col-md-1">
                            <div v-if="countriesLoading"
                            class="spinner-border text-primary float-end mt-1 small" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <error-message class="text-danger small" name="location_id" />
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label class="form-label">
                                Phone Code
                            </label>
                            <vee-field as="select" name="phone_code"
                            class="form-select" >
                                <option v-for="phoneCode in phoneCodes"
                                :value="phoneCode.dial_code" :key="phoneCode">
                                    {{ `${phoneCode.name} +${phoneCode.dial_code}` }}
                                </option>
                            </vee-field>
                            <error-message class="text-danger small" name="phone_code" />
                        </div>
                    </div>

                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">
                                Phone Number
                            </label>
                            <vee-field type="text" name="phone_number" maxlength="9"
                            class="form-control" placeholder="Phone Number" />
                            <error-message class="text-danger small" name="phone_number" />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">
                                Password
                            </label>
                            <vee-field type="password" name="password"
                            class="form-control" placeholder="Password" />
                            <error-message class="text-danger small" name="password" />
                        </div>

                        <div class="mb-3 form-group">
                            <label>
                                Password Confirmation
                            </label>
                            <vee-field type="password" name="password_confirmation"
                            class="form-control" placeholder="Password Confirmation" />
                            <error-message class="text-danger small" name="password_confirmation" />
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <button type="submit" :disabled="signUpLoading"
                    class="btn btn-primary col-md-4">
                        Sign Up
                    </button>

                    <div v-if="signUpLoading"
                    class="spinner-border text-primary m-1" role="status">
                            <span class="visually-hidden"></span>
                    </div>
                </div>
            </vee-form>

            <div v-show="signUpMessage !== ''" class="row d-flex justify-content-center">
                <div :class="signUpMessageClass"
                class="w-50 d-flex mt-2">
                    {{ signUpMessage }}
                </div>
                <router-link to="/" class="text-center small">
                    Already have an account? Login
                </router-link>
            </div>

        </div>
        <!-- End Form -->
</div>

</template>

<script>
import axios from '@/includes/axiosConfig';
import phoneCodes from '@/assets/phone_codes.json';

export default {
  name: 'Signup',
  data() {
    return {
      countriesLoading: true,
      signUpLoading: false,
      signUpMessage: '',
      signUpMessageClass: '',
      countries: null,
      phoneCodes,
      schema: {
        first_name: 'required|min:3|max:50',
        middle_name: 'required|min:3|max:50',
        last_name: 'required|min:3|max:50',
        age: 'required|min_value:16|max_value:25',
        location_id: 'required',
        email: 'required|email|max:255',
        phone_number: 'required|min:9',
        phone_code: 'required',
        password: 'required|min:8|max:100',
        password_confirmation: 'password_mismatch:@password',
      },
      initialValues: {
        age: 16,
        phone_code: '218',
        location_id: '32',
      },
    };
  },
  methods: {
    async fetchCountries() {
      await axios.get('applicantboard/countries')
        .then((res) => {
          this.countries = res.data.data;
          this.countriesLoading = false;
        });
    },
    async sendVerificationLink() {
      await axios.post('applicantboard/email/verify/resend')
        .then((res) => {
          console.log(res);
          this.signUpMessageClass = 'alert alert-success';
          this.signUpMessage = 'Thank you for signing up, a verification email has been sent to your email';
        });
    },
    async signup(values) {
      this.signUpLoading = true;
      console.log(values);
      await axios.post('applicantboard/signup', values)
        .then(() => {
          this.signUpLoading = false;
        })
        .catch((err) => {
          this.signUpLoading = false;
          // eslint-disable-next-line prefer-destructuring
          this.signUpMessage = err.response.data.error;
          this.signUpMessageClass = 'alert alert-danger';
        });
    },
  },
  async created() {
    this.fetchCountries();
  },
};
</script>
