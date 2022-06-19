<template>
  <div v-if="isFinished">
    <div class="container text-center my-5 fw-bold">
      <div class="row">
        <div class="col">
          Pages: {{ numPages }}
        </div>
        <div class="col">
          <!-- <button class="btn btn-primary" @click.prevent="rotatePdf()">rotate</button> -->
        </div>
      </div>

    </div>
      <div v-for="n in numPages" :key="n">
        <pdf :src="url" :page="n"
        class="mx-5 p-3 rounded"
         />
    </div>

  </div>
  <div v-else class="d-flex justify-content-center mt-5">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    <div>Your PDF is loading please wait</div>
  </div>

</template>

<script>
import pdf from 'pdfvuer';
import axios from '@/includes/axiosConfig';
import store from '@/store';

export default {
  components: {
    pdf,
  },
  data() {
    return {
      rotation: 0,
      isFinished: false,
      config: store.state.config,
      totalPages: 0,
      numPages: 0,
      url: undefined,
      axios: Object,
      application_id: '',
      fileName: '',
      store,
    };
  },
  methods: {
    async downloadFile(fileName, applicationId) {
      await axios({
        url: `https://api-scholarship.limu.edu.ly/api/adminboard/applications/${applicationId}/files/${fileName}`,
        method: 'GET',
        responseType: 'blob',
        headers: this.config.headers,
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          this.url = url;
          const bruh = pdf.createLoadingTask(this.url);
          bruh.then((pdfvuer) => {
            this.numPages = pdfvuer.numPages;
          });
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    // rotatePdf() {
    //   if (this.rotation <= 360 && this.rotation >= -360) {
    //     this.rotation += 90;
    //   } else {
    //     this.rotation = 0;
    //   }
    // },
  },
  async created() {
    console.log(this.config);
    this.application_id = localStorage.getItem('application_id');
    this.fileName = localStorage.getItem('fileName');
    await this.downloadFile(this.fileName, this.application_id);
    this.isFinished = true;
  },
};
</script>
