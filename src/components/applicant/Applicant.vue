<template>
    <section>
        <div class="container">
            <div v-if="hasApplication"
            class="card-body border rounded rounded bg-white
            mt-5 w-75 mx-auto">
                <div class="row p-3">
                    <h4>Continue your application progress</h4>
                    <p>You haven't finished your Scholarship application yet</p>

                    <!-- Application statuses -->
                    <div class="row border rounded p-3 m-2 bg-light">
                        <!-- Header -->
                        <div class="row border rounded m-1 p-1 mb-2 bg-white">
                            <div class="col-md-2">
                                Status
                            </div>

                            <div class="col">
                                {{ applicationStatus }}
                            </div>
                        </div>
                        <!-- End Header -->

                        <div class="col">
                            <h5 class="text-center">
                                Faculties Submitted
                            </h5>
                            <div class="row border rounded m-2 p-1 bg-white">
                                <p class="text-center">{{ filesSubmitted ? 'Yes' : 'No' }}</p>
                            </div>
                        </div>

                        <div class="col">
                            <h5 class="text-center">
                                Files Submitted
                            </h5>
                            <div class="row border rounded m-2 p-1 bg-white">
                                <p class="text-center">{{ filesSubmitted ? 'Yes' : 'No' }}</p>
                            </div>
                        </div>

                        <div class="col">
                            <h5 class="text-center">
                                Essays Submitted
                            </h5>
                            <div class="row border rounded m-2 p-1 bg-white">
                               <p class="text-center">{{ essaysSubmitted ? 'Yes' : 'No' }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- End Application statuses  -->

                    <div class="text-end mt-3">
                        <button class="btn btn-primary col-md-3"
                        @click.prevent="this.$router.push({ name: 'applicantForm' })">
                        Continue
                        </button>
                    </div>
                </div>

                <div class="alert alert-warning border fw-bold small">
                    Please note, even though you'v
                    uploaded the files and essays needed, you need to
                    submit each of them individually to finish the application registration process
                </div>
            </div>

            <div v-else
            class="card-body border rounded rounded bg-white mt-5">
                <div class="row p-3">
                    <h4>Criteria For Scholarship</h4>
                    <ul>
                        <li v-for="criteria in content.criteria" :key="criteria">
                            {{ criteria }}
                        </li>
                    </ul>

                    <div class="text-end">
                        <button class="btn btn-primary col-md-3" :disabled="creationLoading"
                        @click.prevent="createApplication()">
                            Create Application
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

</template>

<script>
/* eslint-disable max-len */
import content from '@/assets/widgetContent';
import store from '@/store/index';
import axios from '@/includes/axiosConfig';

export default {
  name: 'Applicant',
  props: {
    axiosConfig: Object,
  },
  data() {
    return {
      applicationStatus: store.state.user.application?.data.applicationStatus.data.submissionStatus.data.status || null,
      filesSubmitted: store.state.user.application?.data.files_status || null,
      essaysSubmitted: store.state.user.application?.data.textuals_status || null,
      user: store.state.user,
      creationLoading: false,
      content,
    };
  },
  computed: {
    hasApplication() {
      return store.state.user.application !== null;
    },
  },
  methods: {
    async createApplication() {
      this.creationLoading = true;
      await axios.post('applicantboard/application', null, this.axiosConfig)
        .then((res) => {
          console.log(res);
          this.creationLoading = false;
          this.$router.push('applicant-form');
        })
        .catch((err) => {
          console.log(err.response);
          this.creationLoading = false;
        });
    },
  },
  mounted() {
    store.dispatch('restoreSession');
    console.log(this.axiosConfig);
  },
};
</script>

<style>

</style>
