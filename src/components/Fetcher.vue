<template>
  <div>Fetcher Component</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  name: "Fetcher",

  setup() {
    onMounted(() => {
      axios.get("/");
    });
  },
});
</script>

<style scoped></style>
