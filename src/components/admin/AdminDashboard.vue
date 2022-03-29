<template>

  <div v-if="dashFinishedLoading">
    <div class="container mt-5 mb-4">
      <div class="card-body bg-white border rounded">

        <vee-form @submit="fetchWithFilter" :initial-values="initialValues">
          <div class="row">
              <div class="col-md-4">
                  <div class="mb-3">
                      <label class="form-label">
                          Nationality
                      </label>
                      <vee-field as="select" name="country_id"
                      class="form-select" >
                          <option value="0">None</option>
                          <option v-for="country in countries"
                          :value="country.id" :key="country">
                              {{ `${country.name}` }}
                          </option>
                      </vee-field>
                  </div>
              </div>

              <div class="col-md-4">
                  <div class="mb-3">
                      <label class="form-label">
                          Status
                      </label>
                      <vee-field as="select" name="status_id"
                      class="form-select" >
                          <option value="0">None</option>
                          <option v-for="status in statuses"
                          :value="status.id" :key="status">
                              {{ `${status.status}` }}
                          </option>
                      </vee-field>
                  </div>
              </div>

              <div class="col mt-4">
                <button class="btn btn-primary">Search</button>
              </div>
          </div>

        </vee-form>

        <div class="row">
          <h3 class="text-end">{{ `Total: ${pagination.total}` }}</h3>
        </div>

        <hr>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Nationality</th>
              <th scope="col" class="text-center">Options</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="application in applications" :key="application.id">
              <th scope="row">{{application.applicant.data.id}}</th>
              <td>{{ `${application.applicant.data.first_name}
                ${application.applicant.data.last_name}` }}</td>
              <td>{{ application.applicant.data.email }}</td>
              <td>{{ application.applicationStatus.data.submissionStatus.data.status }}</td>
              <td>{{ application.applicant.data.country.data.name }}</td>

              <!-- Dropdown button -->
              <td>
                <div class="btn-group">
                  <button type="button" class="btn btn-primary dropdown-toggle"
                  data-bs-toggle="dropdown" aria-expanded="false">

                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <!-- Button trigger modal -->
                      <button type="button" class="dropdown-item"
                      data-bs-toggle="modal" :data-bs-target="`#modal_${application.id}`">
                        View application
                      </button>

                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-success disabled" href="#">
                      Shortlist applicant
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger disabled" href="#">Delete</a></li>
                  </ul>
                </div>

                <div class="modal fade" :id="`modal_${application.id}`"
                tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                          <div class="text-center">
                            {{
                              `${application.applicant.data.first_name}
                              ${application.applicant.data.middle_name}
                              ${application.applicant.data.last_name}`
                            }}
                          </div>

                        </h5>
                        <button type="button"
                        class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="container">
                          <div class="row">
                            <application-view :application="application" />
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer">
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <!-- End of dropdown button -->

            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3" >
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" v-if="!isFirstPage">
              <a class="page-link btn" aria-label="Previous"
              :class="paginationLoading ? 'disabled' : ''"
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
              :class="paginationLoading ? 'disabled' : ''"
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
      applicant: Object,
      applicationFaculties: [],
      paginationLoading: false,
      applicationOpened: false,
      filters: Object,
      dashFinishedLoading: false,
      axiosConfig: store.state.config,
      applications: [],
      countries: [],
      statuses: [],
      pagination: {
        count: 0,
        total: 0,
        perPage: 12,
        currentPage: 1,
        total_pages: 1,
        links: [],
      },
      initialValues: {
        country_id: 0,
        status_id: 0,
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
      this.paginationLoading = true;
      await axios.post(`adminboard/applications?page=${page < 1 ? 1 : page}`, this.filters, this.axiosConfig)
        .then((res) => {
          this.paginationLoading = false;
          this.dashFinishedLoading = true;
          const { pagination } = res.data.meta;
          this.applications = res.data.data;
          this.pagination.count = pagination.count;
          this.pagination.total = pagination.total;
          this.pagination.perPage = pagination.per_page;
          this.pagination.currentPage = pagination.current_page;
          this.pagination.total_pages = pagination.total_pages;
          this.pagination.links = pagination.links;
        })
        .catch(() => {
          this.dashFinishedLoading = true;
          this.paginationLoading = false;
        });
    },
    async fetchWithFilter(values) {
      this.filters = {
        country_id: Number(values.country_id) === 0 ? null : values.country_id,
        status_id: Number(values.status_id) === 0 ? null : values.status_id,
      };

      await this.fetchApplications(1, this.filters);
    },
    async fetchCountries() {
      await axios.get('applicantboard/countries')
        .then((res) => {
          this.countries = res.data.data;
        });
    },
    async fetchApplicationStatuses() {
      await axios.get('adminboard/application_statuses', this.axiosConfig)
        .then((res) => {
          this.statuses = res.data.data;
        });
    },
  },
  async created() {
    await this.fetchCountries();
    await this.fetchApplicationStatuses();
    await this.fetchApplications();
  },
};
</script>
