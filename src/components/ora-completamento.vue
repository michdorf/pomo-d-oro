<template>
  <div v-show="inCorso">Finirai alle {{ oraDiCompletamento }}</div>
</template>

<script>
import date from "../webApp/js/date.js";

export default {
  props: ["iniziatoT", "durataTimer", "inCorso"],
  computed: {
    oraDiCompletamento() {
      if (!this.inCorso) {
        return "---";
      }
      const oraCompl = new Date(this.iniziatoT + this.durataTimer * 1000);
      return (
        date.aggZeri(oraCompl.getHours(), 2) +
        ":" +
        date.aggZeri(oraCompl.getMinutes(), 2)
      );
    }
  }
};
</script>
