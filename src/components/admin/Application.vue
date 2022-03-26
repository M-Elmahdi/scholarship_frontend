<template>
    <div class="container">
      <div class="row">
        <div class="col">
          <!-- Faculties -->
          <div class="m-2 mt-4 p-2 ">
            <h5>Faculties you picked</h5>
            <ul class="list-group">
              <li class="list-group-item">
                <div class="row">
                  <div class="col">
                    <span class="fw-bold">
                      priority
                    </span>
                    faculty name
                  </div>
                </div>
              </li>
            </ul>

            <div class="alert alert-warning border p-2">
              Nothing yet
            </div>
          </div>
          <!-- End Faculties -->
        </div>
        <div class="col">
          <!-- Files -->
            <div class="m-2 mt-4 p-2">
              <h5>
                You have uploaded
                number/number
              </h5>
              <ul class="list-group">
                <li class="list-group-item">
                 <div class="row">
                    <div class="col">
                      bla bla
                    </div>
                 </div>

                </li>
              </ul>

              <div class="alert alert-warning border p-2">
                Nothing yet
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
              essay one
            </p>
          </div>
        </div>

        <div class="col">
          <div class="card-body small">
            <h5>
              Second Essay
            </h5>
            <p class="border rounded p-2">
              essay two
            </p>
          </div>

        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ApplicationView',
  props: {
    application: Object,
  },
  data() {
    return {

    };
  },
  created() {
    console.log(this.application);
  },
};
</script>
