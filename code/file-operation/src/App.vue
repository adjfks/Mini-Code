<script setup>
  import { ref } from 'vue';
  const imgSrc = ref('');
  const fileChange = (e) => {
    const fileList = e.target.files;
    const file = e.target.files[0];
    console.log('fileList: ', fileList);
    console.log('file: ', file);
    
    // Blob
    const fileListBlob = new Blob(e.target.files)
    const fileBlob = new Blob([e.target.files[0]]);
    console.log('fileListBlob: ', fileListBlob);
    console.log('fileBlob: ', fileBlob);

    // Blob slice
    const sliceFileBlob = fileBlob.slice(0, 1000);
    console.log('sliceFileBlob: ', sliceFileBlob);

    // FileReader base64
    const fr = new FileReader();
    fr.readAsDataURL(fileBlob);
    fr.onload = () => {
      imgSrc.value = fr.result;
      console.log('fr.result: ', fr.result);
    }

    // File
    const newFile = new File([sliceFileBlob], '1.webp');
    console.log('newFile: ', newFile);
  }

  // submit
  const submit = (e) => {
    
  }
</script>

<template>
  <div>
    <img :src="imgSrc" alt="" width="300">
    <input type="file" @change="fileChange" multiple>
    <button @click="submit">submit</button>
  </div>
</template>

<style scoped>

</style>
