<template>
    <section>
        <div class="container">
            <div v-if="finishedLoading">
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
                        Please note, even though you've
                        finished all the steps needed, you need to
                        submit the application in the end to finish the proccess.
                    </div>

                    <div class="text-start">
                        <!-- Button trigger modal -->
                        <button type="button"
                        class="btn btn-danger" data-bs-toggle="modal"
                        data-bs-target="#exampleModal">
                        Delete
                        </button>

                        <!-- Modal -->
                        <div v-show="!hasApplication"
                        class="modal fade" id="exampleModal"
                        tabindex="-1" aria-labelledby="exampleModalLabel"
                        aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">
                                            Delete Application
                                        </h5>
                                        <button type="button" class="btn-close"
                                        data-bs-dismiss="modal" aria-label="Close">
                                        </button>
                                    </div>
                                    <div class="modal-body text-danger">
                                        Are you sure you want to delete your application?
                                        note that you will lose any progress during registration
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary"
                                        data-bs-dismiss="modal">
                                            Cancel
                                        </button>
                                        <button @click.prevent="deleteApplication()"
                                        :disabled="deleteLoading"
                                        type="button" class="btn btn-danger"
                                        data-bs-dismiss="modal">
                                            Yes, delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
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

            <div v-else class="d-flex justify-content-center mt-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
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
      deleteLoading: false,
      finishedLoading: false,
    };
  },
  computed: {
    hasApplication() {
      return store.state.user.application !== null;
    },
  },
  methods: {
    async deleteApplication() {
      this.deleteLoading = true;
      await axios.delete(`applicantboard/applications/${this.user.application.data.id}`, null, this.axiosConfig)
        .then((res) => {
          this.deleteLoading = false;
          store.state.user.application = null;
          console.log(res);
        })
        .catch((err) => {
          this.deleteLoading = false;
          console.log(err);
        });
    },
    async createApplication() {
      this.creationLoading = true;
      await axios.post('applicantboard/application', null, this.axiosConfig)
        .then((res) => {
          console.log(res);
          this.creationLoading = false;
          store.dispatch('restoreSession')
            .then(() => this.$router.push('applicant-form'));
        })
        .catch((err) => {
          console.log(err.response);
          this.creationLoading = false;
        });
    },
  },
  mounted() {
    store.dispatch('restoreSession')
      .then(() => {
        this.finishedLoading = true;
        console.log('successfully restored the session');
      })
      .catch(() => {
        console.log('failed to restore session');
      });
  },
};
</script>

<style>

</style>
