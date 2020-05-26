<template>
  <div class="lista-sessioni" style="display: flex; overflow-x: auto">
    <div
      class="giorno cont"
      v-for="(giorno, i) in dateSessioni"
      :key="i"
      style="min-width: 176px; flex: 1;"
    >
      {{ giorno[0].iniziatoT | data }}
      <ul>
        <li v-for="(data, i) in giorno" :key="i">
          {{ data.iniziatoT | ora }}
          <template v-if="data.attivita"
            >(<b>{{ data.attivita.testo }}</b>
            <i>{{ data.attivita.progetto }}</i
            >)</template
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import date from "../webApp/js/date.js";

export default {
  props: ["sessioni"],
  watch: {
    sessioni() {
      this.$el.scrollLeft = this.$el.scrollWidth;
    }
  },
  computed: {
    dateSessioni() {
      const ses = this.sessioni; //.map(ses => date.datastr(ses.iniziatoT, "giornodata"));
      let dataCor = "",
        giorno = [];
      const r = [];
      for (let i = 0; i < ses.length; ) {
        giorno = [];
        dataCor = date.datestamp(ses[i].iniziatoT);
        while (i < ses.length && dataCor === date.datestamp(ses[i].iniziatoT)) {
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
  }
};
</script>
