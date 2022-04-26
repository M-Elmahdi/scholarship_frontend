<template>
    <div class="row">
      <div class="col">
          <!-- Files -->
            <div class="m-2 mt-4 p-2" v-if="!filesLoading">
              <h5>
                 Uploaded
                {{ `${files.length} ${files.length > 1 || files.length === 0 ? 'files' : 'file'}` }}
              </h5>
              <hr>
              <ul v-if="files.length > 0" class="list-group">
                <li class="list-group-item"
                v-for="file in files" :key="file.id">
                 <div class="row">
                    <div class="col">
                      {{ `${file.filetype.data.name}` }}
                    </div>

                    <div class="col">
                      {{ `${file.file_name}` }}
                    </div>

                    <div class="col">
                      <button class="btn btn-primary mt-3"
                      @click.prevent="downloadFile(file.file_name)">
                        Download <i class="fas fa-download"></i>
                      </button>
                    </div>
                 </div>
                </li>
              </ul>
            </div>

            <div v-else class="d-flex justify-content-center mt-5">
              <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          <!-- END FILES -->
        </div>

        <div class="col">
          <div class="m-2 mt-4 p-3 border rounded shadow" v-if="!scoresLoading">

            <!-- Evaluation Header -->
            <h4 class="text-center mt-2">Evaluation Score</h4>
            <hr>
            <!-- End Header -->

            <vee-form :validation-schema="schema"
              @submit="evaluateApplication">
              <div class="row">
                <div class="col">
                    <div class="mb-3">
                        <label class="form-label">
                            Age Score
                        </label>
                        <vee-field type="number" name="age_score" min="0" max="5"
                        :value="scores.age_score"
                        class="form-control" placeholder="Assign Score" />
                        <error-message class="text-danger small" name="age_score" />
                    </div>
                </div>
                <div class="col">
                    <div class="mb-3">
                        <label class="form-label">
                            Income Score
                        </label>
                        <vee-field type="number" name="income_score" min="0" max="5"
                        :value="scores.income_score"
                        class="form-control" placeholder="Assign Score" />
                        <error-message class="text-danger small" name="income_score" />
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                      <div class="mb-3">
                          <label class="form-label">
                              Year 9 Score
                          </label>
                          <vee-field type="number" name="year9_score" min="0" max="5"
                          :value="scores.year9_score"
                          class="form-control" placeholder="Assign Score" />
                          <error-message class="text-danger small" name="year9_score" />
                      </div>
                  </div>

                  <div class="col">
                      <div class="mb-3">
                          <label class="form-label">
                              Year 10 Score
                          </label>
                          <vee-field type="number" name="year10_score" min="0" max="5"
                          :value="scores.year10_score"
                          class="form-control" placeholder="Assign Score" />
                          <error-message class="text-danger small" name="year10_score" />
                      </div>
                  </div>

                  <div class="col">
                      <div class="mb-3">
                          <label class="form-label">
                              Year 11 Score
                          </label>
                          <vee-field type="number" name="year11_score" min="0" max="5"
                          :value="scores.year11_score"
                          class="form-control" placeholder="Assign Score" />
                          <error-message class="text-danger small" name="year11_score" />
                      </div>
                  </div>
                </div>

                <div class="bg-light border m-0 mb-2 p-2 rounded row row-cols-md-auto">
                  <div class="col">
                    Evaluation Estimate:
                  </div>
                  <div class="col">
                    {{ `${scores.level1_score}%` }}
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <div class="text-center">
                    <button class="btn btn-primary col-md-4"
                    :disabled="saveLoading">
                      Save
                    </button>
                    <div class="form-text small">
                      You can optionally assign all or individual scores as needed
                    </div>
                    <hr>
                    <div v-if="saveMsg !== ''" :class="`alert ${saveMsgClass}`"
                    class="mt-2">
                      {{ saveMsg }}
                    </div>
                  </div>
                </div>
              </div>
            </vee-form>
          </div>

          <div v-else class="d-flex justify-content-center mt-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>

    </div>
</template>

<script>
import store from '@/store';
import axios from '@/includes/axiosConfig';

export default {
  name: 'ApplicationEvaluation',
  props: {
    application: Object,
  },
  data() {
    return {
      scoresLoading: true,
      saveLoading: false,
      filesLoading: true,
      axiosConfig: store.state.config,
      files: [],
      essay: {},
      scores: {},
      saveMsgClass: '',
      saveMsg: '',
      schema: {
        age_score: 'min_value:0|max_value:5',
        income_score: 'min_value:0|max_value:5',
        year9_score: 'min_value:0|max_value:5',
        year10_score: 'min_value:0|max_value:5',
        year11_score: 'min_value:0|max_value:5',
      },
    };
  },
  methods: {
    async downloadFile(fileName) {
      await axios({
        url: `https://api-scholarship.limu.edu.ly/api/adminboard/applications/${this.application.id}/files/${fileName}`,
        method: 'GET',
        responseType: 'blob',
        headers: this.axiosConfig.headers,
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          // Create link to local copy of JSON
          const link = document.createElement('a'); // Create anchor tag
          link.href = url; // set href of anchor tag to link created to local copy of JSON
          link.setAttribute('download', fileName); // Set redundant attribute - never used
          document.body.appendChild(link); // Append anchor tag to body
          link.click(); // Programmatically click link
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    async fetchFiles() {
      await axios.get(`adminboard/applications/${this.application.id}/files`, this.axiosConfig)
        .then((res) => {
          this.filesLoading = false;
          this.files = res.data.data;
        });
    },
    async fetchScores() {
      this.scoresLoading = true;
      const filters = {
        application_id: this.application.id,
      };

      await axios.post('adminboard/applications/scores', filters, this.axiosConfig)
        .then((res) => {
          this.scoresLoading = false;
          // eslint-disable-next-line prefer-destructuring
          this.scores = res.data.data[0];
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    evaluateApplication(values) {
      this.saveLoading = true;
      axios.put(`adminboard/applications/${this.application.id}/scores`, values, this.axiosConfig)
        .then(() => {
          this.saveMsgClass = 'alert-success';
          this.saveMsg = 'Saved successfully';
          this.saveLoading = false;
        })
        .catch((err) => {
          console.log(err.response);
          this.saveMsgClass = 'alert-danger';
          this.saveMsg = 'Error, make sure to enter valid data';
          this.saveLoading = false;
        });
    },
  },
  async created() {
    await this.fetchFiles();
    await this.fetchScores();
  },
};
</script>
