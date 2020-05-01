<template>
  <div>
    <h2 style="display: inline">
      <template v-if="attivita.testo">{{ testo }}</template>
      <template v-else>Nessuna attivita corrente</template>
    </h2>
    <div
      v-if="in_edita"
      style="position: fixed; width: 380px; top: calc(50vh - 100px); left: calc(50% - 190px); background: var(--popup-bg-color); padding: 10px; z-index: 2; text-align: left;border-radius: 6px; box-shadow: 0 0 80px 0 gray;"
    >
      <form v-on:submit.prevent="cambia()">
        <h2>Cambia attivita</h2>
        <label>Testo: <input v-model="copia.testo"/></label><br />
        <label
          >Progetto:
          <select v-model="copia.progetto" @change="autocreaProgetto()">
            <option v-for="progetto in progetti" :value="progetto">{{
              progetto
            }}</option>
            <option value="_nuovo_">Nuovo</option>
          </select> </label
        ><br />
        <button type="submit">Salva</button>
      </form>
    </div>
    <button @click.stop="in_edita = true">Cambia</button>
  </div>
</template>

<script>
import { clone } from "@/webApp/js/webapp.helper.js";
import { modifiche_non_salvate } from "@/js/main.js";

export default {
  name: "Attivita",
  props: ["attivita", "sessioni"],
  data() {
    return {
      copia: this.attivita,
      progetti: [],
      in_edita: false
    };
  },
  watch: {
    in_edita(val) {
      modifiche_non_salvate(val); // Non credo the funzioni perche APP non é disponibile da main.js
      if (val) {
        setTimeout(() => {
          const e = this.$el.querySelector("form input");
          e.focus();
          e.select();
        }, 0);
      }
    },
    attivita() {
      this.copia = clone(this.attivita);
    },
    sessioni() {
      this.fetch_progetti();
    }
  },
  methods: {
    cambia() {
      this.$emit("cambia", this.copia);
      this.in_edita = false;

      return false;
    },
    autocreaProgetto() {
      if (this.copia.progetto !== "_nuovo_") {
        return;
      }
      const progetto = prompt("Come si chiama?", "");
      if (progetto) {
        this.copia.progetto = progetto;
        this.progetti.push(this.copia.progetto);
      }
    },
    fetch_progetti() {
      this.progetti = unico(
        this.sessioni.map(ses => {
          return ses.attivita.progetto;
        })
      );
      if (this.progetti.indexOf(this.copia.progetto) === -1) {
        this.progetti = [this.copia.progetto].concat(this.progetti);
      }
    }
  },
  computed: {
    testo() {
      return this.attivita.testo;
    }
  },
  mounted() {
    this.fetch_progetti();
    document.addEventListener(
      "keyup",
      function(ev) {
        if (ev.keyCode === 27) {
          /* esc */ this.in_edita = false;
        }
      }.bind(this)
    );
    document.addEventListener(
      "click",
      function(ev) {
        this.in_edita = false;
      }.bind(this)
    );
    this.$el.addEventListener(
      "click",
      function(ev) {
        ev.stopPropagation(); // Ferma che chiude la finestra
      }.bind(this)
    );
  }
};
</script>
