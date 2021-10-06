import { nextTick, reactive } from "vue";
import { createStore } from "vuex";
import {
  flushPromises,
  mount as _mount,
  MountingOptions,
} from "@vue/test-utils";
import { cloneDeep, merge } from "lodash";

import App from "@/App.vue";
import { storeOptions } from "@/store";

let mockUseRoute = jest.fn();
jest.mock("vue-router", () => {
  return {
    useRoute: (...args: any[]) => mockUseRoute(...args),
  };
});

let mockAxiosGet = jest.fn();
jest.mock("axios", () => ({
  get: (...args: any[]) => mockAxiosGet(...args),
}));

const mount = <T>(Component: T, mountingOptions: MountingOptions<any> = {}) => {
  // const mockStoreState = reactive({ count: 0 });

  const defaultMountingOptions: MountingOptions<any> = {
    // shallow: true,

    global: {
      plugins: [createStore(cloneDeep(storeOptions))],

      mocks: { $route: { param: { postId: "abc" } } },

      stubs: {
        // Fetcher: true,
        // Fetcher: {
        //   template: "<div>Fetcher Stub</div>",
        // },
      },

      // Provide a fake store
      // provide: {
      //   store: {
      //     state: mockStoreState,
      //     dispatch(actionName: string, payload: unknown) {
      //       if (actionName === "increment") {
      //         mockStoreState.count += payload as number;
      //       }
      //     },
      //   },
      // },
    },
  };

  return _mount<T>(Component, merge(defaultMountingOptions, mountingOptions));
};

describe("App", () => {
  beforeEach(() => {
    mockAxiosGet = jest.fn();

    mockUseRoute = jest.fn().mockImplementationOnce(() => ({
      params: {
        postId: "abc",
      },
    }));
  });

  test("Render correctly when counter is odd", async () => {
    const wrapper = mount(App);

    // Only way to set data with composition API.
    wrapper.vm.count = 1;
    // await nextTick(); // Wait for effects that's track by vue to finish (DOM updates by Vue)
    await flushPromises(); // Wait for other async actions to finish (VueX actions, Network requests)

    expect(wrapper.html()).toContain("count: 1. Count is odd.");
  });

  test("Render correctly when counter is even", async () => {
    const wrapper = mount(App);

    // Only way to set data with composition API.
    wrapper.vm.count = 2;
    // await nextTick();
    await flushPromises();

    expect(wrapper.html()).toContain("count: 2. Count is even.");
  });

  test("Clicking on button increment the counter.", async () => {
    const wrapper = mount(App);

    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(wrapper.html()).toContain("count: 1. Count is odd.");
  });

  test("Render correct post id", () => {
    const wrapper = mount(App);

    expect(wrapper.html()).toContain("Current Post ID: abc");
  });

  test("Makes an API call", async () => {
    const wrapper = mount(App);
    console.log(wrapper.html());

    expect(mockAxiosGet).toHaveBeenCalledTimes(1);
    expect(mockAxiosGet).toHaveBeenCalledWith("/");
  });

  test("Emits the correct event and payload", async () => {
    const wrapper = mount(App);

    const emitButton = wrapper.get('[data-test="emitter"]');
    await emitButton.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("myEvent");
    expect(wrapper.emitted("myEvent")).toHaveLength(1);
    expect(wrapper.emitted("myEvent")![0]).toEqual([0, "even"]);

    const incrementButton = wrapper.get("button");
    await incrementButton.trigger("click");
    await emitButton.trigger("click");
    expect(wrapper.emitted("myEvent")).toHaveLength(2);
    expect(wrapper.emitted("myEvent")![1]).toEqual([1, "odd"]);
  });

  test("Should conditionally render admin link", async () => {
    const wrapper = mount(App);

    // isAdmin is false by default
    expect(wrapper.get('[data-test="profile-link"]')).toBeTruthy();
    expect(wrapper.find('[data-test="admin-link"]').exists()).toBe(false);

    wrapper.vm.isAdmin = true;
    await nextTick();

    expect(wrapper.get('[data-test="profile-link"]')).toBeTruthy();
    expect(wrapper.get('[data-test="admin-link"]')).toBeTruthy();
  });
});
