<template>
  <div class="border rounded m-3 mt-3 p-2">
      <div class="text-center mt-3">
          <h4>Submit Application</h4>
      </div>

      <hr>

      <div class="mx-5 mb-3 fw-bold">
        {{ fullname }}
      </div>

      <!-- Faculties -->
      <div class="">
        Faculties you registered
        <ul class="list-group">
          <li class="list-group-item">
            Faculty One
          </li>
          <li class="list-group-item">
            Faculty One
          </li>
          <li class="list-group-item">
            Faculty One
          </li>
        </ul>
      </div>
      <!-- End Faculties -->
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
      uploadedFiles: [],
    };
  },
  computed: {
    fullname() {
      return `${store.state.user.first_name} ${store.state.user.middle_name} ${store.state.user.last_name}`;
    },
  },
  methods: {
    async fetchFiles() {
      await axios.delete(`applicantboard/applications/${this.userApplication.id}/files`, this.axiosConfig)
        .then((res) => {
          this.uploadedFiles = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  async mounted() {
    this.fetchFiles();
  },
};
</script>
