<template>
    <navbar />
    <section>
        <div class="card-body border rounded rounded bg-white mb-5
            mt-5 w-75 mx-auto">
            <ul class="nav nav-tabs" >
                <li class="nav-item">
                    <a class="nav-link btn btn-outline-primary"
                    @click.prevent="stepsDone = 0"
                    :class="[
                    stepOneFlag ? 'active' : '',
                    applicationSubmitted ? 'disabled' : ''
                     ]"
                     role="button">1.Faculty</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" role="button"
                    @click.prevent="stepsDone = 1"
                    :class="[
                    stepTwoFlag ? 'active' : '',
                    applicationSubmitted ? 'disabled' : ''
                    ]">2.Files</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" role="button"
                    @click.prevent="stepsDone = 2"
                    :class="[
                    stepThreeFlag ? 'active' : '',
                    applicationSubmitted ? 'disabled' : ''
                    ]"
                    tabindex="-1" aria-disabled="true">
                        3.Essay
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" role="button"
                    @click.prevent="stepsDone = 3"
                    :class="stepFourFlag ? 'active' : ''"
                    tabindex="-1" aria-disabled="true">
                        4.Submit Application
                    </a>
                </li>
            </ul>

            <div v-if="finishedLoading">
              <keep-alive>
                <step-one v-if="stepOneFlag"
                :userApplication="userApplication"
                :axiosConfig="configGetter"
                @stepUpToggle="stepUpToggle"/>
              </keep-alive>

              <keep-alive>
                <step-two v-if="stepTwoFlag"
                :userApplication="userApplication"
                :axiosConfig="configGetter"
                @stepDownToggle="stepDownToggle"
                @stepUpToggle="stepUpToggle"/>
              </keep-alive>

              <keep-alive>
                <step-three v-if="stepThreeFlag"
                :userApplication="userApplication"
                :axiosConfig="configGetter"
                @stepDownToggle="stepDownToggle"
                @stepUpToggle="stepUpToggle"/>
              </keep-alive>

              <step-four v-if="stepFourFlag"
              :userApplication="userApplication"
              :axiosConfig="configGetter"
              @stepDownToggle="stepDownToggle"
              @stepUpToggle="stepUpToggle"
              @submitApplication="submitApplication"/>
            </div>

            <div v-else class="d-flex justify-content-center mt-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

        </div>
    </section>
</template>

<script>
import axios from '@/includes/axiosConfig';
import Navbar from '@/components/Navbar.vue';
import StepOne from '@/components/applicant/form_steps/StepOne.vue';
import StepTwo from '@/components/applicant/form_steps/StepTwo.vue';
import StepThree from '@/components/applicant/form_steps/StepThree.vue';
import { KeepAlive } from 'vue';
import store from '@/store';
import StepFour from '@/components/applicant/form_steps/StepFour.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'ApplicantForm',
  components: {
    KeepAlive,
    Navbar,
    StepOne,
    StepTwo,
    StepThree,
    StepFour,
  },
  data() {
    return {
      applicationSubmitted: false,
      hasApplication: false,
      stepsDone: 0,
      userApplication: null,
      finishedLoading: false,
    };
  },
  computed: {
    ...mapGetters(['configGetter']),
    stepOneFlag() {
      return this.stepsDone === 0;
    },
    stepTwoFlag() {
      return this.stepsDone === 1;
    },
    stepThreeFlag() {
      return this.stepsDone === 2;
    },
    stepFourFlag() {
      return this.stepsDone === 3;
    },
  },
  methods: {
    submitApplication() {
      this.applicationSubmitted = true;
      this.stepsDone = 3;
    },
    stepUpToggle() {
      if (this.stepsDone < 3) {
        this.stepsDone += 1;
      }
    },
    stepDownToggle() {
      if (this.stepsDone >= 0) {
        this.stepsDone -= 1;
      }
    },
    async fetchUserApplication() {
      await axios.get('applicantboard/applications', this.configGetter)
        .then((res) => {
          if (typeof res.data.data !== 'undefined') {
            this.hasApplication = true;
            this.userApplication = res.data.data;
            this.finishedLoading = true;

            if (this.userApplication.applicationStatus.data.status_id === 2) {
              this.applicationSubmitted = true;
              this.stepsDone = 3;
            }
          }
        })
        .catch((err) => console.log(err));
    },
  },
  async created() {
    await this.fetchUserApplication();
  },
  async beforeRouteEnter(to, from, next) {
    if (store.state.authenticated) {
      await store.dispatch('restoreSession');
      next();
    } else {
      next({ name: '' });
    }
  },
};
</script>
