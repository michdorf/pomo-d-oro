var statoStoragek = "pomo-d-oro";
var pomoStore = new Vuex.Store({
  state: {
    sinc_inx: 0,
    iniziato_t: 0,
    finito: true,
    tempo: 25*60,
    tempi: [25, 5, 15], /* Cambiato da std_stato in ambiente */
    durata_timer: 0,
    punto_lavoro: 0,
    pausa_lunga_dopo: 4,
    obbiettivo_pro_giorno: 4,
    attivita: new Attivita(),
    sessioni: [],
    ses_dati: [], // data array as stored in db
  },
  mutations: {
    ripristina_state(state, state_salvato){
      state_salvato = Object.assign({}, state, state_salvato);
      this.replaceState(state_salvato);
    },
    sinc_inx(state, sinc_inx) {state.sinc_inx = sinc_inx; salva_state();},
    inc_sinc_inx(state) {state.sinc_inx++; salva_state();},
    iniziato_t(state, t) {state.iniziato_t = t; },
    finito(state, finito) {state.finito = finito; salva_state();},
    tempo(state, tempo) {state.tempo = tempo; salva_state();},
    durata_timer(state, durata_timer) {state.durata_timer = durata_timer; salva_state();},
    punto_lavoro(state, punto_lavoro) {state.punto_lavoro = punto_lavoro; salva_state();},
    pausa_lunga_dopo(state, pausa_lunga_dopo) {state.pausa_lunga_dopo = pausa_lunga_dopo; salva_state();},
    attivita_arr(state, attivita_arr) {
      state.attivita = Attivita.fromArray(attivita_arr);
      salva_state();
    },
    attivita(state, attivita) {
      state.attivita = attivita;
      salva_state();
    },
    prossimo_punto(state) {
      state.punto_lavoro++;
      if (state.punto_lavoro >= (state.pausa_lunga_dopo * 2)) {
        state.punto_lavoro = 0;
      }
      this.commit('imposti_timer');
      salva_state();
    },
    imposti_timer(state) {
      var punto_inx = (this.getters.e_pausa_lunga) ? 2 : (this.getters.e_in_pausa ? 1 : 0);
      this.commit('durata_timer', state.tempi[punto_inx] * 60);

      this.commit('tempo', this.getters.durata_timer);
    },
    registra_sessione(state) {
      if (this.getters.e_in_pausa) { // Non registrare una pausa come un sessione
        return;
      }
      var sessione = new Sessione(this.getters.iniziato_t, this.getters.punto_lavoro, this.getters.durata_timer, this.getters.attivita);
      state.sessioni.push(sessione);
      state.ses_dati.push(sessione.data());
      salva_state();
    },
    ses_dati(state, ses_dati) {
      state.ses_dati = ses_dati;
      state.sessioni = state.ses_dati.map(sarr => Sessione.fromArray(sarr));
      salva_state();
    }
  },
  getters: {
    stato_completo(state){
      return state;
    },
    sinc_id(state) {return state.sinc_inx;},
    iniziato_t(state){ return state.iniziato_t;},
    finito(state){ return state.finito;},
    tempo(state){ return state.tempo;},
    durata_timer(state){ return state.durata_timer;},
    punto_lavoro(state){ return state.punto_lavoro;},
    pausa_lunga_dopo(state){ return state.pausa_lunga_dopo;},
    obbiettivo_pro_giorno(state){return state.obbiettivo_pro_giorno},
    attivita(state){return state.attivita},
    sessioni(state){ return state.sessioni || [];},
    ses_dati(state){ return state.ses_dati || [];},

    e_in_pausa(state, getters) { // Se il punto lavoro e una pausa
      return ((getters.punto_lavoro % 2) === 1);
    },
    e_pausa_lunga(state, getters) {
      // focus (0) pause (1) focus pause focus pause focus pausa-lunga (7)
      return (getters.punto_lavoro === ((state.pausa_lunga_dopo * 2) - 1));
    }
  }
});

function salva_state(event) {
  localStorage.setItem(statoStoragek, JSON.stringify(pomoStore.getters.stato_completo));
}

// window.addEventListener("beforeunload", salva_state);
window.addEventListener("blur", salva_state);

var state_salvato = localStorage.getItem(statoStoragek);
if (state_salvato) {
  pomoStore.commit("ripristina_state", JSON.parse(state_salvato));
} else {
  pomoStore.commit("ripristina_state", ambiente.std_stato);
}
