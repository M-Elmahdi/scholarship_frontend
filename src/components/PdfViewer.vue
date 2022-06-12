<template>
    <div>
        <iframe src="`${}`" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
  name: 'PdfViewer',
  props: {
    fileName: String,
    path: String,
  },
  data() {
    return {

    };
  },
  computed: {
    getFile() {
      if (this.fileName !== '') {
        return `${this.path}?file=${this.fileName}`;
      }
      return this.path;
    },

  },
};
</script>

<style scoped>
div {
  width: 50%;
  height: 79vh;
  min-width: 400px;
}
</style>
