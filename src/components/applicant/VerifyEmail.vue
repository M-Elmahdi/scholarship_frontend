<template>
    <div class="container">
    <div class="row">
        <div class="text-center mt-5 border p-3 alert alert-warning">
            Please verify your email address before proceeding
            <br>
            <button :disabled="emailSending" class="btn btn-primary mt-3"
            @click="resendVerificationEmail">
            Resend verification email
            </button>

            <div v-if="emailSendingMessage.length > 0">
            <div class="border mt-3 col-md-4 d-flex m-auto bg-white rounded"
            :class="emailSendingMessageClass">
            <div class="text-center">
              {{ emailSendingMessage }}
            </div>

            </div>
            </div>

            <div v-if="emailSending" class="d-flex justify-content-center mt-1">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import store from '@/store';
import axios from '@/includes/axiosConfig';

export default {
  name: 'VerifyEmail',
  data() {
    return {
      axiosConfig: store.state.config,
      emailSending: false,
      emailSendingMessage: '',
      emailSendingMessageClass: '',
    };
  },
  methods: {
    async resendVerificationEmail() {
      this.emailSendingMessage = '';
      this.emailSending = true;
      await axios.post('applicantboard/email/verify/resend', this.axiosConfig)
        .then(() => {
          this.emailSending = false;
          this.emailSendingMessageClass = 'text-success';
          this.emailSendingMessage = 'Email has been sent successfully';
        })
        .catch(() => {
          this.emailSending = false;
          this.emailSendingMessageClass = 'text-danger';
          this.emailSendingMessage = 'Something wrong happened, please try again later';
        });
    },
  },
};
</script>
