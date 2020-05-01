<template>
  <div style="font-size: 0; padding: 12px 0 12px 0">
      <app-arco v-for="fatto in n_fatte" :perc="100"></app-arco>
      <app-arco v-if="tempo" :perc="(durataTimer - tempo)/durataTimer * 100"></app-arco>
      <app-arco v-for="v in n_vuote" :perc="0"></app-arco>
    </div>
</template>

<script>
export default {
  name: "Cerchi",
  props: ["n_fatte", "tempo", "obbiettivo", "durataTimer"], // tempo = sekunder eller null
  computed: {
    n_vuote() {
      var n_attuali = this.n_fatte;
      if (this.tempo) {
        n_attuali++;
      }
      var n_vuote = this.obbiettivo - (n_attuali % this.obbiettivo);

      return n_vuote;
    }
  }
}
</script>