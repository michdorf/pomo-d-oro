<template>
  <font style="color: var(--dim-text-color)">
    <img :src="icon" />
    <h3 v-if="ePausaLunga">Pausa lunga</h3>
    <h3 v-else-if="eInPausa">Pausa</h3>
    <h3 v-else>Concentrazione</h3>
  </font>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

// The @Component decorator indicates the class is a Vue component
@Component
export default class IndicatoreDiStato extends Vue {
  @Prop(Boolean) readonly inCorso!: boolean;
  @Prop(Boolean) readonly eInPausa!: boolean;
  @Prop(Boolean) readonly ePausaLunga!: boolean;

  // Computed property (aka. getter)
  get icon() {
    return require("@/assets/iconi/" +
      (this.inCorso ? "timer.svg" : "timer_off.svg"));
  }
}
</script>

<style scoped>
h3 {
  display: inline-block;
  margin: 0;
}

img {
  width: 1.2em;
  padding-right: 0.2em;
  justify-content: center;
}
</style>
