<template>

  <div v-if="dashFinishedLoading">
    <div class="container mt-5 mb-4">
      <div class="card-body bg-white border rounded">
        <h5>All Applicants</h5>
        <hr>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col" class="text-center">Options</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="application in applications" :key="application.id">
              <th scope="row"></th>
              <td>{{ `${application.applicant.data.first_name}
                ${application.applicant.data.last_name}` }}</td>
              <td>{{ application.applicant.data.email }}</td>
              <td>{{ application.applicationStatus.data.submissionStatus.data.status }}</td>
              <td class="text-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-primary dropdown-toggle"
                  data-bs-toggle="dropdown" aria-expanded="false">

                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">View Application</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-success disabled" href="#">
                      Shortlist Applicant
                      </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger disabled" href="#">Delete</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3" >
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" v-if="!isFirstPage">
              <a class="page-link btn" aria-label="Previous"
              @click="fetchApplications(--pagination.currentPage)">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li class="page-item">
              <a class="page-link">
                {{ pagination.currentPage }}/{{ pagination.total_pages }}
              </a>
            </li>
            <li v-if="!isLastPage" class="page-item">
              <a class="page-link btn" aria-label="Next"
              @click="fetchApplications(++pagination.currentPage)">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>

  <div v-else class="d-flex justify-content-center mt-5">
      <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
      </div>
  </div>

  <application-view />

    <!-- Button trigger modal -->
  <!-- <button type="button" class="btn btn-primary"
  data-bs-toggle="modal" data-bs-target="#exampleModal">
    Launch demo modal
  </button> -->

  <!-- Modal -->
  <!-- <div class="modal fade" id="exampleModal"
  tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Applicant Name</h5>
          <button type="button"
          class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row">
              <div class="col">
                Stuff to write about
              </div>
              <div class="col">
                Stuff to read about
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
        </div>
      </div>
    </div>
  </div> -->

</template>

<script>
import axios from '@/includes/axiosConfig';
import store from '@/store';
import ApplicationView from '@/components/admin/Application.vue';

export default {
  name: 'AdminDashboard',
  components: {
    ApplicationView,
  },
  data() {
    return {
      applicationOpened: false,
      dashFinishedLoading: false,
      axiosConfig: store.state.config,
      applications: [],
      pagination: {
        count: 0,
        total: 0,
        perPage: 12,
        currentPage: 1,
        total_pages: 1,
        links: [],
      },
    };
  },
  computed: {
    isFirstPage() {
      return this.pagination.currentPage === 1;
    },
    isLastPage() {
      return this.pagination.currentPage === this.pagination.total_pages;
    },
  },
  methods: {
    async fetchApplications(page) {
      await axios.post(`adminboard/applications?page=${page < 1 ? 1 : page}`, null, this.axiosConfig)
        .then((res) => {
          this.dashFinishedLoading = true;
          const { pagination } = res.data.meta;
          this.applications = res.data.data;
          this.pagination.count = pagination.count;
          this.pagination.total = pagination.total;
          this.pagination.perPage = pagination.per_page;
          this.pagination.currentPage = pagination.current_page;
          this.pagination.total_pages = pagination.total_pages;
          this.pagination.links = pagination.links;
          console.log(this.pagination);
        })
        .catch((err) => {
          this.dashFinishedLoading = true;
          console.log(err.response);
        });
    },
  },
  async created() {
    await this.fetchApplications();
    console.log(this.applications);
  },
};
</script>
