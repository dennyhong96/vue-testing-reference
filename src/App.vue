<template>
  <p>Current Post ID: {{ route.params.postId }}</p>
  <div>count: {{ count }}. Count is {{ oddEven }}.</div>
  <button @click="count += 1">Increment</button>
  <button data-test="emitter" @click="handleEmit">
    Emit
  </button>
  <Fetcher />
</template>

<script lang="ts">
import { computed, defineComponent, inject } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import _store from "@/store";
import Fetcher from "@/components/Fetcher.vue";

export default defineComponent({
  name: "App",

  components: {
    Fetcher,
  },

  setup(props, context) {
    // const store = useStore();
    const store: typeof _store = inject("store")!;
    const count = computed<number>({
      get() {
        return store.state.count;
      },
      set(amount) {
        store.dispatch("increment", amount);
      },
    });
    const oddEven = computed(() => (count.value % 2 === 0 ? "even" : "odd"));

    const route = useRoute();

    const handleEmit = () => {
      context.emit("myEvent", count.value, oddEven.value);
    };

    return {
      count,
      oddEven,

      route,

      handleEmit,
    };
  },

  emits: ["myEvent"],
});
</script>
