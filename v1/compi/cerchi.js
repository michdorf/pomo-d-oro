Vue.component("app-cerchi", {
  props: ["n_fatte", "tempo", "obbiettivo", "durata_timer"], // tempo = sekunder eller null
  computed: {
    n_vuote() {
      var n_attuali = this.n_fatte;
      if (this.tempo) {
        n_attuali++;
      }
      var n_vuote = this.obbiettivo - (n_attuali % this.obbiettivo);

      return n_vuote;
    }
  },
  template: `
    <div style="font-size: 0; padding: 12px 0 12px 0">
      <app-arco v-for="fatto in n_fatte" :perc="100"></app-arco>
      <app-arco v-if="tempo" :perc="(durata_timer - tempo)/durata_timer * 100"></app-arco>
      <app-arco v-for="v in n_vuote" :perc="0"></app-arco>
    </div>
  `
});
