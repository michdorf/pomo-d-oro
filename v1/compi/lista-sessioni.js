Vue.component("app-lista-sessioni", {
  props: ["sessioni"],
  watch: {
    sessioni() {
      this.$el.scrollLeft = this.$el.scrollWidth;
    }
  },
  computed: {
    date_sessioni() {
      var ses = this.sessioni; //.map(ses => date.datastr(ses.iniziato_t, "giornodata"));
      var data_cor = "", giorno = [];
      var r = [];
      for (var i = 0; i < ses.length;) {
        giorno = [];
        data_cor = date.datestamp(ses[i].iniziato_t);
        while (i < ses.length && data_cor === date.datestamp(ses[i].iniziato_t)) {
          giorno.push(ses[i]);
          i++;
        }
        r.push(giorno);
      }
      return r;
    }
  },
  mounted() {
    this.$el.scrollLeft = this.$el.scrollWidth;
  },
  template: `
    <div class="lista-sessioni" style="display: flex; overflow-x: auto">
      <div class="giorno cont" v-for="giorno in date_sessioni" style="min-width: 176px; flex: 1;">
        {{giorno[0].iniziato_t | data}}
        <ul>
          <li v-for="data in giorno">{{data.iniziato_t | ora}}
          <template v-if="data.attivita">(<b>{{data.attivita.testo}}</b> <i>{{data.attivita.progetto}}</i>)</template>
          </li>
        </ul>
      </div>
    </div>
  `
});
