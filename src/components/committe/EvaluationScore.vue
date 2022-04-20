<template>
    <div v-if="!scoresLoading"
    class="border rounded m-auto text-center bg-light fw-bold p-2">
        {{ `${scores.level1_score}%` }}
    </div>

    <div v-else class="text-center">
      <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
      </div>
  </div>
</template>

<script>
/* eslint-disable prefer-destructuring */

import axios from '@/includes/axiosConfig';
import store from '@/store';

export default {
  name: 'EvaluationScore',
  props: {
    application: Object,
  },
  data() {
    return {
      scores: {},
      axiosConfig: store.state.config,
      scoresLoading: true,
    };
  },
  methods: {
    async fetchScores() {
      this.scoresLoading = true;
      const filters = {
        application_id: this.application.id,
      };

      await axios.post('committeeboard/applications/scores', filters, this.axiosConfig)
        .then((res) => {
          this.scoresLoading = false;
          console.log(res.data.data);
          this.scores = res.data.data[0];
        })
        .catch((err) => {
          // this.scoresLoading = false;
          console.log(err.response);
        });
    },
  },
  async created() {
    await this.fetchScores();
  },
};
</script>
