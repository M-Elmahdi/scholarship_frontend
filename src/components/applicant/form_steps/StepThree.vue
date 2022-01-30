<template>
    <div class="border rounded m-3 p-3">
      <!-- FORM DIV -->
      <div class="mt-1">
        <div class="text-center mb-3">
          <h4>Essays</h4>
        </div>
        <vee-form @submit="uploadEssay" :validation-schema="schema">
          <div class="form-control bg-light mb-3">
            <label class="form-label fw-bold">
              Why did you choose the (first) faculty you chose?
            </label>
            <vee-field as="textarea" rows="7" v-model="essay_one"
            :disabled="submitLoading"
            class="form-control"
            name="essay_one"/>
            <div class="row">
              <div class="col">
                <div class="small ms-2">
                  Essay should be at least 150 words minimum and 250 words maximum
                </div>
              </div>

              <div class="col">
                <div class="border rounded p-1 small mt-2 bg-white ms-auto text-center col-md-3">
                  Words: {{ essay_one_word_count }}
                </div>
              </div>
            </div>

            <error-message class="text-danger small m-1" name="essay_one" />
          </div>

          <div class="form-control bg-light mb-3">
            <label class="form-label form-label fw-bold">
              Discuss one of the following
              <ol class="list-group list-group-numbered">
                <li class="list-item p-1">Role of university in community service</li>
                <li class="list-item p-1">Ethics of your future profession</li>
                <li class="list-item p-1">Issue of your choice</li>
              </ol>
            </label>
            <vee-field as="textarea" rows="7"
            v-model="essay_two" :disabled="submitLoading"
            class="form-control" name="essay_two"/>
            <div class="row">
              <div class="col">
                <div class="small ms-2">
                  Essay should be at least 150 words minimum and 250 words maximum
                </div>
              </div>

              <div class="col">
                <div class="border rounded bg-white small p-1 mt-2 ms-auto text-center col-md-3">
                  Words: {{ essay_two_word_count }}
                </div>
              </div>
            </div>

            <error-message class="text-danger small m-1" name="essay_two" />
          </div>

          <div class="text-center">
            <button :disabled="submitLoading"
            class="btn btn-primary">Save Essays</button>
            <div class="alert alert-danger p-2 mt-2" v-show="submitMessage.length > 0">
              {{ submitMessage }}
            </div>
          </div>

        </vee-form>
      </div>
      <!-- END FORM DIV -->
      <hr class="m-2">
      <div class="m-1">
        <button class="btn btn-success" @click.prevent="submitStepThree"
        aria-describedby="infoSubmit">Submit Step Three <i class="fas fa-save"></i></button>
        <div id="infoSubmit" class="form-text">
            Note that, once you submit this step, you cannot change any of the existing
            credentials you've submitted, unless you delete the whole application.
        </div>
      </div>
    </div>
</template>

<script>
import axios from '@/includes/axiosConfig';

export default {
  name: 'FormStepThree',
  props: {
    userApplication: Object,
    axiosConfig: Object,
  },
  data() {
    return {
      submitLoading: false,
      submitMessage: '',
      essay_one: '',
      essay_two: '',
      schema: {
        essay_one: 'required',
        essay_two: 'required',
      },
    };
  },
  computed: {
    essay_one_word_count() {
      return this.essay_one.split(' ')
        .filter((n) => n !== '')
        .length;
    },
    essay_two_word_count() {
      return this.essay_two.split(' ')
        .filter((n) => n !== '')
        .length;
    },
  },
  methods: {
    stepUpToggle() {
      this.$emit('stepUpToggle');
    },
    stepDownToggle() {
      this.$emit('stepDownToggle');
    },
    async fetchEssayApplcation() {
      this.submitLoading = true;
      await axios.get(`applicantboard/applications/${this.userApplication.id}/essay`, this.axiosConfig)
        .then((res) => {
          this.submitLoading = false;
          this.essay_one = res.data.data.why_essay;
          this.essay_two = res.data.data.five_year_essay;
        })
        .catch((err) => {
          console.log(err);
          this.submitLoading = false;
        });
    },
    async uploadEssay() {
      this.submitLoading = true;
      this.submitMessage = '';

      const data = {
        why_essay: this.essay_one,
        five_year_essay: this.essay_two,
      };

      await axios.put(`applicantboard/applications/${this.userApplication.id}/essay`, data,
        this.axiosConfig)
        .then((res) => {
          console.log(res);
          this.submitLoading = false;
        })
        .catch((err) => {
          console.log(err.response);
          this.submitLoading = false;
        });
    },
    submitStepThree() {
      console.log('step three submit');
    },
  },
  async beforeUpdate() {
    this.fetchEssayApplcation();
  },
};
</script>
