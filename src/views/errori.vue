<template>
  <div>
    <!-- <button @click="toggle()">{{ toggleStr }}</button> -->
    <template v-show="mostra">
      <p v-for="(errore, i) in errori" v-bind:key="i">{{ i }}: {{ errore }}</p>
    </template>
    <template v-if="!errori.length">
      <p style="font-size: 22px">Nessun errore</p>
    </template>
  </div>
</template>

<script>
import { erroriOsserv } from "../js/main.js";

export default {
  name: "errori",
  data() {
    return {
      errori: [],
      ascoltatore: undefined,
      mostra: true
    };
  },
  methods: {
    toggle() {
      this.mostra = !this.mostra;
    }
  },
  created() {
    this.ascoltatore = erroriOsserv.senti(errore => this.errori.push(errore));
    erroriOsserv.autoZitto(this.ascoltatore, this);
    erroriOsserv.riproduci();
  },
  computed: {
    toggleStr() {
      return this.mostra
        ? "Skjul"
        : `Vis fejlmeddelser (${this.errori.length})`;
    }
  }
};
</script>
