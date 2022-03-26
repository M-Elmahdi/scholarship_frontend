<template>
    <div class="border rounded m-3">
        <!-- Step One -->
        <vee-form :validation-schema="stepOneSchema" @submit="registerFaculty"
        :initial-values="initialValues">
            <div class="mt-2 p-2">
                <div class="text-center">
                    <h4>Choose Faculty</h4>
                </div>

                <label class="form-label">
                    Choose Faculty you wish to enroll
                </label>
                <vee-field as="select" name="faculty_id" :disabled="!facultiesLoading"
                class="form-select" aria-describedby="selectHelpBlock">
                    <option v-for="faculty in faculties"
                    :key="faculty.id" :value="faculty.id">
                        {{ faculty.name }}
                    </option>
                </vee-field>
                <div id="selectHelpBlock" class="form-text">
                    You are required to apply for at least one faculty
                    and a maximum of 3 faculties, the first faculty will be considered your
                    top priority.
                </div>

                <div class="text-center">
                    <button :disabled="assignFacultyLoading"
                    class="btn btn-primary col-md-2 mt-3">
                        Assign Faculty <i class="fas fa-upload"></i>
                    </button>
                </div>

                <div v-show="assignMessageError !== ''" class="alert alert-danger m-2">
                  {{ assignMessageError }}
                </div>

                <div v-if="hasAssignedFaculties"
                class="m-2 mt-4 border rounded p-2 bg-light">
                  <h5>Faculties you picked</h5>
                  <ul class="list-group">
                    <li v-for="assignedFaculty in assignedFaculties" :key="assignedFaculty.id"
                    class="list-group-item">
                      <div class="row">
                        <div class="col">
                          <span class="fw-bold">{{ `${assignedFaculty.priority}. ` }}</span>
                          {{ assignedFaculty.faculty.data.name }}
                        </div>

                        <div class="col text-end">
                          <button :disabled="deleteFacultyLoading"
                          @click.prevent="deleteFaculty(assignedFaculty)"
                          class="btn-sm btn btn-danger">
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>

                  </ul>
                </div>

                <div v-else class="alert alert-warning border text-center mt-3">
                  You haven't picked any faculties yet
                </div>

                <div class="text-center mt-3">
                    <div v-show="errorMessage !== ''"
                    class="alert alert-danger text-center">
                        {{ errorMessage }}
                    </div>
                </div>
            </div>
        </vee-form>
        <!-- End Step One -->
        <hr class="m-2">
        <div class="m-3 text-end">
          <button class="btn btn-primary" @click.prevent="stepUpToggle"
          aria-describedby="stepOneSubmit">Save and continue
          <i class="fas fa-arrow-circle-right"></i></button>
          <div id="stepOneSubmit" class="form-text">
            You can navigate through the steps from the tabs above
          </div>
        </div>
    </div>
</template>

<script>
import axios from '@/includes/axiosConfig';
import store from '@/store';

export default {
  name: 'FormStepOne',
  props: {
    userApplication: Object,
    axiosConfig: Object,
  },
  data() {
    return {
      application: store.state.user.application.data,
      deleteFacultyLoading: false,
      errorMessage: '',
      assignMessageError: '',
      assignedFaculties: [],
      assignFacultyLoading: false,
      facultiesLoading: false,
      faculties: null,
      stepOneSchema: {
        faculty_id: 'required',
      },
      initialValues: {
        faculty_id: 1,
      },
    };
  },
  computed: {
    hasAssignedFaculties() {
      return this.assignedFaculties.length > 0;
    },
    priority() {
      return (this.assignedFaculties.length < 3)
        ? this.assignedFaculties.length + 1
        : this.assignedFaculties.length;
    },
  },
  methods: {
    async deleteFaculty(faculty) {
      this.deleteFacultyLoading = true;
      await axios.delete(`applicantboard/applications/${this.application.id}/faculty_priority/${faculty.id}`, this.axiosConfig)
        .then((res) => {
          this.fetchApplication();
          this.deleteFacultyLoading = false;
          console.log(res);
        })
        .catch((err) => {
          this.deleteFacultyLoading = false;
          console.log(err);
        });
    },
    stepUpToggle() {
      this.$emit('stepUpToggle');
    },
    async fetchFaculties() {
      await axios.get('applicantboard/faculties', this.axiosConfig)
        .then((res) => {
          this.faculties = res.data.data;
          this.facultiesLoading = true;
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    async registerFaculty(values) {
      this.assignMessageError = '';
      this.assignFacultyLoading = true;
      const data = {
        faculty_id: values.faculty_id,
        priority: this.priority,
      };
      await axios.post(`applicantboard/applications/${this.application.id}/faculty_priority`, data, this.axiosConfig)
        .then((res) => {
          this.fetchApplication();
          this.assignFacultyLoading = false;
          console.log(res);
        })
        .catch((err) => {
          console.log(err.response);
          this.assignFacultyLoading = false;
          this.assignMessageError = 'Sorry, something wrong happened';
        });
    },
    submitStepOne() {
      console.log('step one submitted');
    },
    async fetchApplication() {
      await axios.get('applicantboard/applications', this.axiosConfig)
        .then((res) => {
          console.log(res.data.data.applicationFaculties.data);
          this.assignedFaculties = res.data.data.applicationFaculties.data;
        })
        .catch((err) => console.log(err.response));
    },
  },
  async created() {
    await this.fetchFaculties();
    await this.fetchApplication();
  },
};
</script>
