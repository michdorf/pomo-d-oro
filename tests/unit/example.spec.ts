import { shallowMount } from "@vue/test-utils";
import Arco from "@/components/arco.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const perc = 50;
    const wrapper = shallowMount(Arco, {
      propsData: { perc }
    });
    expect(wrapper.props().perc).toEqual(perc);
  });
});
