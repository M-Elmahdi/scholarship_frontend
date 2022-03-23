<template>

    <div v-if="finishedLoading">
      <div class="border rounded m-3 mt-3 p-2">
      <div class="text-center mt-3">
          <h4>{{ fullname }}</h4>
          <small>{{ user.email }}</small>
      </div>

      <hr>

      <div class="row">
        <div class="col">
          <!-- Faculties -->
          <div class="m-2 mt-4 p-2 ">
            <h5>Faculties you picked</h5>
            <ul v-if="assignedFaculties.length > 0" class="list-group">
              <li v-for="assignedFaculty in assignedFaculties" :key="assignedFaculty.id"
              class="list-group-item">
                <div class="row">
                  <div class="col">
                    <span class="fw-bold">
                      {{ `Priority ${assignedFaculty.priority}: ` }}
                    </span>
                    {{ assignedFaculty.faculty.data.name }}
                  </div>
                </div>
              </li>
            </ul>

            <div v-else class="alert alert-warning border p-2">
              Nothing yet
            </div>
          </div>
          <!-- End Faculties -->
        </div>
        <div class="col">
          <!-- Files -->
            <div class="m-2 mt-4 p-2">
              <h5>
                You have uploaded
                {{ `${uploadedFiles.length} ${ uploadedFiles.length > 1 ? 'files' : 'file' }` }}
              </h5>
              <ul v-if="uploadedFiles.length > 0" class="list-group">
                <li class="list-group-item"
                 v-for="(file, index) in uploadedFiles" :key="file.id">
                 <div class="row">
                    <div class="col">
                      {{ `${index + 1}. ${file.filetype.data.name}` }}
                    </div>
                 </div>

                </li>
              </ul>

              <div v-else class="alert alert-warning border p-2">
                Nothing yet
              </div>
            </div>
          <!-- END FILES -->
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="card-body small">
            <h5>First Essay</h5>
            <p class="border rounded p-2">
              {{ essay_one }}
            </p>
          </div>
        </div>

        <div class="col">
          <div class="card-body small">
            <h5>
              Second Essay
            </h5>
            <p class="border rounded p-2">
              {{ essay_two }}
            </p>
          </div>

        </div>
      </div>

      <div class="text-center">
        <button @click.prevent="submitApplication()"
        :disabled="submitLoading"
        class="btn btn-primary">
          Submit Application
        </button>
        <div v-show="submitMessage.length > 0"
        class="p-2 m-3"
        :class="submitMessageClass">
          {{ submitMessage }}
        </div>
        <div id="stepOneSubmit" class="form-text alert alert-warning border m-2 p-2">
            Be warned, once you submit the application you cannot edit it.
            To redo it, you have to delete the whole application
        </div>
      </div>
      </div>
    </div>
    <div v-else class="d-flex justify-content-center mt-5">
      <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
      </div>
    </div>

</template>

<script>
import axios from '@/includes/axiosConfig';
import store from '@/store';

export default {
  name: 'FormStepFour',
  props: {
    userApplication: Object,
    axiosConfig: Object,
  },
  data() {
    return {
      application: store.state.user.application.data,
      submitMessageClass: '',
      submitLoading: false,
      submitMessage: '',
      essay_one: '',
      essay_two: '',
      user: store.state.user,
      assignedFaculties: [],
      uploadedFiles: [],
      finishedLoading: false,
    };
  },
  computed: {
    fullname() {
      return `${store.state.user.first_name} ${store.state.user.middle_name} ${store.state.user.last_name}`;
    },
  },
  methods: {
    async submitApplication() {
      this.submitMessage = '';
      this.submitLoading = true;
      await axios.post(`applicantboard/applications/${this.application.id}/submit`,
        { status_id: 2 }, this.axiosConfig)
        .then(() => {
          this.submitMessageClass = 'alert alert-success';
          this.submitMessage = 'Thank you, you have submitted your application';
          this.submitLoading = false;
          this.$emit('submitApplication');
        })
        .catch((err) => {
          console.log();
          this.submitMessageClass = 'alert alert-danger';
          // eslint-disable-next-line prefer-destructuring
          this.submitMessage = err.response.data.error[0];
          this.submitLoading = false;
        });
    },
    async fetchAssignedFaculties() {
      await axios.get('applicantboard/applications', this.axiosConfig)
        .then((res) => {
          this.assignedFaculties = res.data.data.applicationFaculties.data;
        });
    },
    async fetchFiles() {
      await axios.get(`applicantboard/applications/${this.application.id}/files`, this.axiosConfig)
        .then((res) => {
          this.uploadedFiles = res.data.data;
        });
    },
    async fetchEssayApplcation() {
      await axios.get(`applicantboard/applications/${this.application.id}/essay`, this.axiosConfig)
        .then((res) => {
          this.submitLoading = false;
          this.essay_one = res.data.data.why_essay;
          this.essay_two = res.data.data.five_year_essay;
        })
        .catch(() => {
          this.submitLoading = false;
        });
    },
  },
  async created() {
    await this.fetchFiles();
    await this.fetchAssignedFaculties();
    await this.fetchEssayApplcation();
    this.finishedLoading = true;
  },
};
</script>
