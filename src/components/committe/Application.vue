<template>
    <div class="">
      <div class="row">
        <div class="col">
          <!-- Faculties -->
          <div class="m-2 mt-4 p-2 ">
            <h5>Faculties picked</h5>
            <ul v-if="faculties.length > 0" class="list-group">
              <li v-for="faculty in faculties" :key="faculty.id"
              class="list-group-item">
                <div class="row">
                  <div class="col">
                    <span class="fw-bold">
                      {{ faculty.priority }}
                    </span>
                      {{ faculty.faculty.data.name }}
                  </div>
                </div>
              </li>
            </ul>

            <div v-else class="mt-2">
              <div class="alert alert-warning border">
                No faculties assigned yet
              </div>
            </div>
          </div>
          <!-- End Faculties -->
        </div>
        <div class="col">
          <!-- Files -->
            <div class="m-2 mt-4 p-2">
              <h5>
                Uploaded
                {{ `${files.length} ${files.length > 1 || files.length ? 'files' : 'file'}` }}
              </h5>
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

              <div v-else>
                <div class="alert alert-warning border">
                  No uploaded files yet
                </div>
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
              {{ essay.five_year_essay }}
            </p>
          </div>
        </div>

        <div class="col">
          <div class="card-body small">
            <h5>
              Second Essay
            </h5>
            <p class="border rounded p-2">
              {{ essay.why_essay }}
            </p>
          </div>

        </div>
      </div>
    </div>
</template>

<script>
import axios from '@/includes/axiosConfig';
import store from '@/store';

export default {
  name: 'ApplicationView',
  props: {
    application: Object,
  },
  data() {
    return {
      faculties: [],
      axiosConfig: store.state.config,
      files: [],
      essay: {},
    };
  },
  computed: {

  },
  methods: {
    async downloadFile(fileName) {
      await axios({
        url: `https://api-scholarship.limu.edu.ly/api/committeeboard/applications/${this.application.id}/files/${fileName}`,
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
      await axios.get(`committeeboard/applications/${this.application.id}/files`, this.axiosConfig)
        .then((res) => {
          this.files = res.data.data;
        });
    },
    async fetchEssays() {
      await axios.get(`committeeboard/applications/${this.application.id}/essay`, this.axiosConfig)
        .then((res) => {
          this.essay = res.data.data;
        });
    },
  },
  async created() {
    await this.fetchFiles();
    await this.fetchEssays();
    this.faculties = this.application.applicationFaculties.data;
  },
};
</script>
