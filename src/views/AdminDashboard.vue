<template>
<div>
<admin-navbar />
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
              <th scope="col">Date</th>
              <th scope="col" class="text-center">Options</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="n in 10" :key="n">
              <th scope="row">{{ n }}</th>
              <td>Muhammed Elmahdi</td>
              <td>mo@gmail.com</td>
              <td>2021/2/21</td>
              <td class="text-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-primary dropdown-toggle"
                  data-bs-toggle="dropdown" aria-expanded="false">

                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">View Application</a></li>

                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-success" href="#">Shortlist Applicant</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#">Delete</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        <div class="mt-3">
          <nav aria-label="Page navigation example">
            <ul class="pagination">
              <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li class="page-item"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
    </div>
</div>

</template>

<script>
import AdminNavbar from '../components/AdminNavbar.vue';

export default {
  name: 'AdminDashboard',
  components: {
    AdminNavbar,
  },
};
</script>
