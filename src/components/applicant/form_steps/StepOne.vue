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
                    <button class="btn btn-primary col-md-2 mt-3">
                        Assign Faculty <i class="fas fa-upload"></i>
                    </button>
                </div>

                <div class="m-2 mt-4 border rounded p-2 bg-light">
                  <h5>Faculties you picked depending on your selection</h5>
                  <ul class="list-group">
                    <li class="list-group-item">
                      <div class="row">
                        <div class="col">
                          Faculty One
                        </div>

                        <div class="col text-end">
                          <button @click.prevent="test()"
                          class="btn-sm btn btn-danger">
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>

                    <li class="list-group-item">
                      <div class="row">
                        <div class="col">
                          Faculty Two
                        </div>

                        <div class="col text-end">
                          <button @click.prevent="test()"
                          class="btn-sm btn btn-danger">
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>

                    <li class="list-group-item">
                      <div class="row">
                        <div class="col">
                          Faculty Three
                        </div>

                        <div class="col text-end">
                          <button @click.prevent="test()"
                          class="btn-sm btn btn-danger">
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>

                  </ul>
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
        <div class="m-3">
          <button class="btn btn-success" @click.prevent="submitStepOne"
          aria-describedby="stepOneSubmit">Submit Step One <i class="fas fa-save"></i></button>
          <div id="stepOneSubmit" class="form-text">
              Note that, once you submit this step, you cannot change any of the existing
              credentials you've submitted, unless you delete the whole application.
          </div>
        </div>
    </div>
</template>

<script>
import axios from '@/includes/axiosConfig';

export default {
  name: 'FormStepOne',
  props: {
    userApplication: Object,
    axiosConfig: Object,
  },
  data() {
    return {
      errorMessage: '',
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
  methods: {
    test() {
      console.log('test');
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
        .catch((err) => console.log(err));
    },
    async registerFaculty() {
      //
    },
    submitStepOne() {
      console.log('step one submitted');
    },
  },
  async created() {
    this.fetchFaculties();
  },
};
</script>
