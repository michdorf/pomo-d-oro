Vue.component("app-errori", {
  data() {
    return {
      errori: [],
      mostra: false
    }
  },
  methods: {
    toggle() {
      this.mostra = !this.mostra;
    }
  },
  created() {
    errori_osserv.senti((errore) => this.errori.push(errore));
  },
  computed: {
    toggleStr() {
      return this.mostra ? "Skjul" : `Vis fejlmeddelser (${this.errori.length})`;
    }
  },
  template: `
    <div>
      <button @click="toggle()">{{toggleStr}}</button>
      <template v-if="mostra">
        <p v-for="(errore, i) in errori" v-bind:key="i">{{i}}: {{errore}}</p>
      </template>
    </div>
  `
})
