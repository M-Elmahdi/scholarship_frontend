/* eslint-disable eqeqeq */
<template>
    <div class="border rounded m-3">
    <!-- Step Two -->
        <div class="mt-2 p-2">
            <div class="text-center">
                <h4>Upload Files</h4>
            </div>
            <vee-form @submit="uploadFile"
            enctype=multipart/form-data
            :initial-values="{ file_type_id: 1 }">
              <label for="file_type_id">Choose File to Upload</label>
              <vee-field as="select" class="form-select" name="file_type_id"
              @change="currentIndex">
                <option :value="file_type.id"
                v-for="file_type in file_types" :key="file_type.id">
                {{ `${file_type.name}` }} :: {{ file_type.required ? 'Required' : 'Optional' }}
                </option>
              </vee-field>

              <vee-field id="file" v-model="file"
              :rules="fileWithNoteFlag
                ? {size: 2000, mimes: 'pdf'}
                : {size: 2000, mimes: 'pdf', required: true}"
              name="file" type="file" class="form-control mt-3" />
              <error-message name="file" class="text-danger mt-2 small" />

              <!-- <div v-show="fileWithNoteFlag" class="mt-2 form-control bg-light">
                <label for="note" class="form-label">Note</label>
                <vee-field name="note" type="text"
                :rules="fileWithNoteFlag
                  ? {required: false}
                  : ''"
                placeholder="Insert note"
                class="form-control small" />
              </div>
              <error-message class="text-danger small mt-3" name="note" /> -->

              <div class="text-center">
                <button class="btn btn-primary col-md-2 mt-3"
                :disabled="uploadingFile">
                  Upload File <i class="fas fa-upload"></i>
                </button>
                <div v-show="uploadingFile" class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div v-show="errorMessage !== ''"
              class="alert alert-danger p-2 mt-2 text-center" >
                {{ errorMessage }}
              </div>

            </vee-form>

            <!-- Uploaded Files -->
            <div class="form-control bg-light mt-3" v-if="uploadedFiles.length > 0">
              <h5>
                You have uploaded
                {{ `${uploadedFiles.length} ${ uploadedFiles.length > 1 ? 'files' : 'file' }` }}
              </h5>
              <ul class="list-group">
                <li class="list-group-item"
                 v-for="file in uploadedFiles" :key="file.id">
                 <div class="row">
                    <div class="col">
                      {{ file.filetype.data.name }}
                    </div>

                    <div class="col text-end">
                      <button @click.prevent="deleteFile(file.id)"
                      :disabled="deletingFile"
                      class="btn btn-danger small btn-sm">
                        Remove
                      </button>
                    </div>
                 </div>

                </li>
              </ul>
            </div>

            <div v-else class="alert alert-warning text-center mt-3">
              No files uploaded yet
            </div>
            <!-- End Uploaded Files -->

        </div>
    <!-- End Step Two -->
      <hr class="m-2">
      <div class="m-3">
        <button class="btn btn-success" @click.prevent="submitStepTwo"
        aria-describedby="infoSubmit">Submit Step Two <i class="fas fa-save"></i></button>
        <div id="infoSubmit" class="form-text">
            Note that, once you submit this step, you cannot change any of the existing
            credentials you've submitted, unless you delete the whole application.
        </div>
      </div>
    </div>
</template>

<script>
/* eslint-disable max-len */
/* eslint-disable max-len */
import axios from '@/includes/axiosConfig';

export default {
  name: 'FormStepTwo',
  props: {
    userApplication: Object,
    axiosConfig: Object,
  },
  data() {
    return {
      deletingFile: false,
      loadingFileTypes: true,
      uploadedFiles: [],
      errorMessage: '',
      file_types: null,
      hasNote: false,
      currentFileType: 1,
      fileWithNote: [6, 8, 9],
      file: undefined,
      note: '',
      uploadingFile: false,
    };
  },
  computed: {
    fileWithNoteFlag() {
      return typeof this.fileWithNote.find((fileWithNote) => fileWithNote === Number(this.currentFileType))
          !== 'undefined';
    },
  },
  methods: {
    async fetchFileTypes() {
      await axios.get('applicantboard/files_types', this.axiosConfig)
        .then((res) => {
          this.file_types = res.data.data;
          console.log(this.file_types);
        })
        .catch((err) => console.log(err));
    },
    stepUpToggle() {
      this.$emit('stepUpToggle');
    },
    stepDownToggle() {
      this.$emit('stepDownToggle');
    },
    async uploadFile(values) {
      this.uploadingFile = true;
      const data = new FormData();
      data.append('file', this.file[0]);
      data.append('file_type_id', values.file_type_id);
      data.append('note', values.note);
      await axios.post(`applicantboard/applications/${this.userApplication.id}/file_upload`, data, this.axiosConfig)
        .then((res) => {
          this.uploadingFile = false;
          console.log(res);
        })
        .catch(() => {
          this.uploadingFile = false;
          this.errorMessage = 'Some error happened please make sure you haven\'t uploaded the file already';
        });
    },
    currentIndex(event) {
      this.errorMessage = '';
      this.currentFileType = event.target.value;
      document.getElementById('file').value = '';
      this.file = undefined;
      this.hasNote = false;
      const value = this.fileWithNote.find((fileWithNote) => fileWithNote === Number(event.target.value));
      if (typeof value !== 'undefined') {
        this.hasNote = true;
      }
    },
    async fetchFiles() {
      await axios.get(`applicantboard/applications/${this.userApplication.id}/files`, this.axiosConfig)
        .then((res) => {
          this.uploadedFiles = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async deleteFile(fileId) {
      this.deletingFile = true;
      await axios.delete(`applicantboard/applications/${this.userApplication.id}/files/${fileId}`, this.axiosConfig)
        .then((res) => {
          this.deletingFile = false;
          console.log(res);
        })
        .catch((err) => {
          this.deletingFile = false;
          console.log(err.response);
        });
    },
    submitStepTwo() {
      console.log('submit step two');
    },
  },
  async created() {
    this.fetchFileTypes();
  },
  async beforeUpdate() {
    this.fetchFiles();
  },
};
</script>
