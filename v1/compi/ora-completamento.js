Vue.component("app-ora-completamento", {
  props: ["iniziato_t", "durata_timer", "in_corso"],
  computed: {
    ora_di_completamento() {
      if (!this.in_corso) {
        return "---";
      }
      var ora_compl = new Date(this.iniziato_t + this.durata_timer*1000);
      return date.aggZeri(ora_compl.getHours(), 2) + ":" + date.aggZeri(ora_compl.getMinutes(), 2);
    }
  },
  template: `
    <div v-show="in_corso">
      Finirai alle {{ora_di_completamento}}
    </div>
  `
});
