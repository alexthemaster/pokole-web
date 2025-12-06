<script setup lang="ts">
  import { RouterView } from "vue-router";
</script>

<template>
  <div id="app-container">
    <RouterView />
  </div>
</template>

<style scoped>
  #app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
