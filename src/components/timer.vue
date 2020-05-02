<template>
  <div style="position: relative; text-align: center">
    <div
      class="timer"
      style="position: absolute; height: 1em; width: 100%; text-align: center"
      :style="{ top: 'calc(' + quadranteSize / 2 + 'px - 0.6em)' }"
    >
      {{ tempoStr }}
      <div style="font-size: initial">
        <OraCompletamento
          :iniziatoT="$store.getters.iniziatoT"
          :durataTimer="$store.getters.durataTimer"
          :inCorso="!$store.getters.finito"
        ></OraCompletamento>
      </div>
    </div>
    <Quadrante :perc="perc" :canvasSize="quadranteSize"></Quadrante>
  </div>
</template>
<script>
import OraCompletamento from "./ora-completamento.vue";
import Quadrante from "./quadrante.vue";

export default {
  name: "Timer",
  props: ["perc", "tempoStr"],
  components: {
    OraCompletamento,
    Quadrante
  },
  data() {
    return {
      quadranteSize: 280
    };
  }
};
</script>
