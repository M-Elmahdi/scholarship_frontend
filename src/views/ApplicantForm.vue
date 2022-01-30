<template>
    <navbar />
    <section>
        <div class="card-body border rounded rounded bg-white mb-5
            mt-5 w-75 mx-auto">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link btn btn-outline-primary"
                    @click.prevent="stepsDone = 0"
                    :class="stepOneFlag ? 'active' : ''" role="button">1.Faculty</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" role="button"
                    @click.prevent="stepsDone = 1"
                    :class="stepTwoFlag ? 'active' : ''">2.Files</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" role="button"
                    @click.prevent="stepsDone = 2"
                    :class="stepThreeFlag ? 'active' : ''"
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

            <!-- STEP ONE -->
            <step-one v-show="stepOneFlag"
            :userApplication="userApplication"
            :axiosConfig="configGetter"
            @stepUpToggle="stepUpToggle"/>
            <!-- END STEP ONE -->

            <!-- STEP TWO -->
            <step-two v-show="stepTwoFlag"
            :userApplication="userApplication"
            :axiosConfig="configGetter"
            @stepDownToggle="stepDownToggle"
            @stepUpToggle="stepUpToggle"/>
            <!-- END STEP TWO -->

            <!-- STEP THREE -->
            <step-three v-show="stepThreeFlag"
            :userApplication="userApplication"
            :axiosConfig="configGetter"
            @stepDownToggle="stepDownToggle"
            @stepUpToggle="stepUpToggle"/>
            <!-- END STEP THREE -->

            <!-- STEP THREE -->
            <step-four v-show="stepFourFlag"
            :userApplication="userApplication"
            :axiosConfig="configGetter"
            @stepDownToggle="stepDownToggle"
            @stepUpToggle="stepUpToggle"/>
            <!-- END STEP THREE -->
        </div>
    </section>
</template>

<script>
import axios from '@/includes/axiosConfig';
import Navbar from '@/components/Navbar.vue';
import StepOne from '@/components/applicant/form_steps/StepOne.vue';
import StepTwo from '@/components/applicant/form_steps/StepTwo.vue';
import StepThree from '@/components/applicant/form_steps/StepThree.vue';
import StepFour from '@/components/applicant/form_steps/StepFour.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'ApplicantForm',
  components: {
    Navbar, StepOne, StepTwo, StepThree, StepFour,
  },
  data() {
    return {
      hasApplication: false,
      stepsDone: 0,
      userApplication: undefined,
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
            console.log(this.userApplication);
          }
          console.log(this.hasApplication);
        })
        .catch((err) => console.log(err));
    },
  },
  async created() {
    await this.fetchUserApplication();
  },
};
</script>
