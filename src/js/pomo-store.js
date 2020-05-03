import Vue from "vue";
import Vuex from "vuex";
import Attivita from "./attivita.js";
import Sessione from "./Sessione.js";

Vue.use(Vuex);

const statoStoragek = "pomo-d-oro";
let pomoStore = {};
const stdState = { tempi: [25, 5, 15], pausaLungaDopo: 4, sesDati: [] };

function salvaState() {
  localStorage.setItem(
    statoStoragek,
    JSON.stringify(pomoStore.getters.statoCompleto)
  );
}

pomoStore = new Vuex.Store({
  state: {
    iniziatoT: 0,
    finito: true,
    tempo: 25 * 60,
    tempi: [25, 5, 15] /* Cambiato da std_stato in ambiente */,
    durataTimer: 0,
    puntoLavoro: 0,
    pausaLungaDopo: 4,
    obbiettivoProGiorno: 4,
    attivita: new Attivita(),
    sessioni: [],
    sesDati: [] // data array as stored in db
  },
  mutations: {
    ripristinaState(state, stateSalvato) {
      stateSalvato = Object.assign({}, state, stateSalvato);
      this.replaceState(stateSalvato);
    },
    iniziatoT(state, t) {
      state.iniziatoT = t;
    },
    finito(state, finito) {
      state.finito = finito;
      salvaState();
    },
    tempo(state, tempo) {
      state.tempo = tempo;
      salvaState();
    },
    durataTimer(state, durataTimer) {
      state.durataTimer = durataTimer;
      salvaState();
    },
    puntoLavoro(state, puntoLavoro) {
      state.puntoLavoro = puntoLavoro;
      salvaState();
    },
    pausaLungaDopo(state, pausaLungaDopo) {
      state.pausaLungaDopo = pausaLungaDopo;
      salvaState();
    },
    attivitaArr(state, attivitaArr) {
      state.attivita = Attivita.fromArray(attivitaArr);
      salvaState();
    },
    attivita(state, attivita) {
      state.attivita = attivita;
      salvaState();
    },
    prossimoPunto(state) {
      state.puntoLavoro++;
      if (state.puntoLavoro >= state.pausaLungaDopo * 2) {
        state.puntoLavoro = 0;
      }
      this.commit("impostiTimer");
      salvaState();
    },
    impostiTimer() {
      /* var punto_inx = (this.getters.ePausaLunga) ? 2 : (this.getters.eInPausa ? 1 : 0);
      this.commit('durataTimer', state.tempi[punto_inx] * 60);
      */
      this.commit("tempo", this.getters.durataTimer);
    },
    registraSessione(state) {
      if (this.getters.eInPausa) {
        // Non registrare una pausa come un sessione
        return;
      }
      const sessione = new Sessione(
        this.getters.iniziatoT,
        this.getters.puntoLavoro,
        this.getters.durataTimer,
        this.getters.attivita
      );
      state.sessioni.push(sessione);
      state.sesDati.push(sessione.data());
      salvaState();
    },
    sesDati(state, sesDati) {
      state.sesDati = sesDati;
      state.sessioni = state.sesDati.map(sarr => Sessione.fromArray(sarr));
      salvaState();
    }
  },
  getters: {
    statoCompleto(state) {
      return state;
    },
    iniziatoT(state) {
      return state.iniziatoT;
    },
    finito(state) {
      return state.finito;
    },
    tempo(state) {
      return state.tempo;
    },
    durataTimer(state) {
      return state.durataTimer;
    },
    puntoLavoro(state) {
      return state.puntoLavoro;
    },
    pausaLungaDopo(state) {
      return state.pausaLungaDopo;
    },
    obbiettivoProGiorno(state) {
      return state.obbiettivoProGiorno;
    },
    attivita(state) {
      return state.attivita;
    },
    sessioni(state) {
      return state.sessioni || [];
    },
    sesDati(state) {
      return state.sesDati || [];
    },

    eInPausa(state, getters) {
      // Se il punto lavoro e una pausa
      return getters.puntoLavoro % 2 === 1;
    },
    ePausaLunga(state, getters) {
      // focus (0) pause (1) focus pause focus pause focus pausa-lunga (7)
      return getters.puntoLavoro === state.pausaLungaDopo * 2 - 1;
    }
  }
});

// window.addEventListener("beforeunload", salvaState);
window.addEventListener("blur", salvaState);

const stateSalvato = localStorage.getItem(statoStoragek);
if (stateSalvato) {
  pomoStore.commit("ripristinaState", JSON.parse(stateSalvato));
} else {
  pomoStore.commit("ripristinaState", stdState);
}

export default pomoStore;
export { statoStoragek };
