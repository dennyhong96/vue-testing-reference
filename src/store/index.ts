import { createStore, StoreOptions } from "vuex";

export const storeOptions: StoreOptions<{ count: number }> = {
  state: {
    count: 0,
  },

  mutations: {
    increment(state, amount) {
      state.count += amount;
    },
  },

  actions: {
    increment(context, amount) {
      context.commit("increment", amount);
    },
  },

  modules: {},
};

export default createStore(storeOptions);
