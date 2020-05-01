import { shallowMount } from "@vue/test-utils";
import Arco from "@/components/arco.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(Arco, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
