<template>
  <loading
    v-model:active="isLaoding"
    :can-cancel="false"
    :is-full-page="true"
    loader="dots"
    :z-index="99999999999"
    color="#1F3559"
  />
  <!-- <LoaderContainer></LoaderContainer> -->
  <router-view></router-view>
</template>

<script setup>
import Login from "./Login.vue";
import Home from "./Home.vue";
import LoaderContainer from "./components/LoaderContainer.vue";
import Loading from "vue-loading-overlay";
import { useMainStore } from "./storage/store";
import { storeToRefs } from "pinia";
const store = useMainStore();
const { isLaoding } = storeToRefs(store);
</script>

<style scoped></style>
