<template>

  <div v-if="dashFinishedLoading">
  <div class="nav_blue_gradient pb-3">
    <div class="container">
      <div class="text-end">
        <button class="btn btn-light"
        data-bs-toggle="modal" data-bs-target="#createMembers">
          Create Committee Members
        </button>
      </div>
    </div>
  </div>
    <div class="container mt-5 mb-4">
      <div class="card-body bg-white border rounded">

        <vee-form @submit="fetchWithFilter" :initial-values="initialValues">
          <div class="row">

              <div class="col">
                  <div class="mb-3">
                      <label class="form-label">Applicant Id</label>
                      <vee-field type="number" name="applicant_id"
                      class="form-control" />
                  </div>
              </div>

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
              <th scope="col" class="text-center">Level-1 Eval</th>
              <th scope="col">Options</th>

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
              <td>
                <evaluation-score :application="application" />
              </td>

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
                    <li>
                      <button class="dropdown-item"
                      data-bs-toggle="modal" :data-bs-target="`#shortlist_${application.id}`">
                        {{
                          application.applicationStatus.data.submissionStatus.data.status
                          === 'Shortlisted'
                          ?
                          'Remove from Shortlist'
                          :
                          'Shortlist Applicant'
                          }}
                      </button>
                    </li>
                  </ul>
                </div>

                <!-- Modal -->
                <div class="modal fade" :id="`shortlist_${application.id}`"
                data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">
                          Confirm shortlisting
                        </h5>
                        <button type="button" class="btn-close"
                        data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div v-if="
                        application.applicationStatus.data.submissionStatus.data.status
                          !== 'Shortlisted'
                        ">
                          You're about to shortlist the applicant
                          <div class="fw-bold">
                            {{
                              `${application.applicant.data.first_name}
                              ${application.applicant.data.middle_name}
                              ${application.applicant.data.last_name}`
                            }}
                          </div>
                          under the email address
                          <div class="fw-bold">
                            {{ `${application.applicant.data.email}` }}
                          </div>
                          An email will be sent to the applicant after 24 Hours from his
                          shortlisting action.

                          <hr>
                          <div class="text-danger">
                            You can cancel the email sending action if you
                            <span class="fw-bold underline">
                              remove the applicant from the shortlist
                            </span>
                            under 24 Hours from his shortlisting action.
                          </div>
                        </div>

                        <div v-else>
                          Are you sure you want to remove
                          {{
                            `${application.applicant.data.first_name}
                              ${application.applicant.data.middle_name}
                              ${application.applicant.data.last_name}`
                          }}
                          from the shortlist?
                        </div>

                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                        data-bs-dismiss="modal">Cancel</button>

                        <button type="button" class="btn btn-success"
                          data-bs-dismiss="modal"
                          @click="shortlistApplication(
                          application.id,
                          application.applicationStatus.data.submissionStatus.data.status)">
                          {{
                            application.applicationStatus.data.submissionStatus.data.status
                            !== 'Shortlisted' ? 'Shortlist' : 'Remove'
                          }}
                        </button>
                      </div>
                    </div>
                  </div>
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

                <button class="btn btn-warning ms-1"
                data-bs-toggle="modal" :data-bs-target="`#evaluation_${application.id}`">
                  <i class="far fa-edit"></i>
                </button>

                <div class="modal fade" :id="`evaluation_${application.id}`"
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
                            <application-evaluation :application="application" />
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

    <div class="modal fade" id="createMembers"
      tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                <div class="text-center">
                  Create Members
                </div>

              </h5>
              <button type="button"
              class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <create-member />
                </div>
              </div>
            </div>
            <div class="modal-footer">
            </div>
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
import ApplicationView from '@/components/admin/Application.vue';
import ApplicationEvaluation from '@/components/admin/ApplicationEvaluation.vue';
import EvaluationScore from '@/components/admin/EvaluationScore.vue';
import CreateMember from '@/components/admin/CreateMember.vue';

export default {
  name: 'AdminDashboard',
  components: {
    ApplicationView,
    ApplicationEvaluation,
    EvaluationScore,
    CreateMember,
  },
  data() {
    return {
      name: './sample.pdf', // change which pdf file loads
      path: 'lib/pdfjs-2.3.200-dist/web/viewer.html',
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
        applicant_id: Number(values.applicant_id) === 0 ? null : values.applicant_id,
      };

      await this.fetchApplications(1, this.filters);
    },
    async fetchCountries() {
      await axios.get('adminboard/countries', this.axiosConfig)
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
    async shortlistApplication(applicationId, applicationStatus) {
      const status = {
        status_id: applicationStatus === 'Shortlisted' ? 1 : 3,
      };

      await axios.put(`adminboard/applications/${applicationId}/status`, status, this.axiosConfig)
        .then(() => {
          this.fetchApplications(this.pagination.currentPage, this.filters);
        })
        .catch((err) => {
          console.log(err.response);
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
