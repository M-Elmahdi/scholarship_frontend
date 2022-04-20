<template>
<div class="row">
    <div class="col">
        Committe Members
        <div v-if="members !== null">
            <div v-if="members.length > 0">
                <ol v-for="member in members" :key="member"
                class="list-group">
                    <li class="list-group-item">
                        <div class="row">
                            <div class="col">
                                {{ member.name }}
                            </div>
                            <div class="col">
                                {{ member.email }}
                            </div>
                        </div>
                    </li>
                </ol>
            </div>
        <div v-else>
            <div class="alert alert-warning border m-3">
                No Committe members are registered in the system yet
            </div>
        </div>
        </div>

        <div v-else class="d-flex justify-content-center mt-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

    </div>
    <div class="col border rounded bg-light p-3">
        <vee-form @submit="createMember" :validation-schema="schema">
            <div class="row">
                <h5 class="text-center">Create a member</h5>

                <div class="row mb-3">
                    <label class="form-label">
                        Name
                    </label>
                    <vee-field name="name" class="form-control" />
                    <error-message class="text-danger small" name="name" />
                </div>

                <div class="row mb-3">
                    <label class="form-label">
                        Email
                    </label>
                    <vee-field name="email" class="form-control" />
                    <error-message class="text-danger small" name="email" />
                </div>

                <div class="row mb-3">
                    <label class="form-label">
                        Password
                    </label>
                    <vee-field type="password" name="password" class="form-control" />
                    <error-message class="text-danger small" name="password" />
                </div>

                <div class="row mb-3">
                    <label class="form-label">
                        Password Confirmation
                    </label>
                    <vee-field type="password" name="password_confirmation" class="form-control" />
                    <error-message class="text-danger small" name="password_confirmation" />
                </div>

                <div class="row">
                    <div class="text-center">
                        <button class="btn btn-primary col-md-4"
                        :disabled="registerLoading">
                        Register Member
                        </button>
                    </div>

                    <div v-if="registerMsg.length > 0">
                        <div class="p-1 text-center mt-3"
                        :class="`alert ${registerMsgClass}`">
                            <p>
                                {{ registerMsg }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </vee-form>
    </div>
</div>

</template>

<script>
import axios from '@/includes/axiosConfig';
import store from '@/store';

export default {
  name: 'CreateMember',
  data() {
    return {
      axiosConfig: store.state.config,
      members: null,
      registerLoading: false,
      registerMsg: '',
      registerMsgClass: '',
      schema: {
        name: 'required|min:3|max:50',
        email: 'required|email|max:255',
        password: 'required|min:8|max:100',
        password_confirmation: 'password_mismatch:@password',
      },
    };
  },
  methods: {
    async createMember(values) {
      this.registerMsg = '';
      this.registerloading = true;
      await axios.post('adminboard/committees', values, this.axiosConfig)
        .then((res) => {
          console.log(res);
          this.registerloading = false;
          this.fetchCommitteMembers();
        })
        .catch(() => {
          this.registerMsg = 'error, make sure the email address is unique';
          this.registerMsgClass = 'alert-danger';
          this.registerloading = false;
        });
    },
    async fetchCommitteMembers() {
      await axios.get('adminboard/committees', this.axiosConfig)
        .then((res) => {
          this.members = res.data.data;
        });
    },
  },
  async created() {
    await this.fetchCommitteMembers();
    console.log(this.members);
  },

};
</script>
