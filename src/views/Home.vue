<template>
  <main
    id="app"
    :class="{
      inCorso: inCorso,
      focus: !eInPausa && !ePausaLunga,
      pausa: eInPausa || ePausaLunga
    }"
  >
    <Notif></Notif>
    <h1>Pomodoro <button @click="riazzera()">x</button></h1>
    <IndicatoreDiStato
      :inCorso="inCorso"
      :eInPausa="eInPausa"
      :ePausaLunga="ePausaLunga"
    ></IndicatoreDiStato>
    <AttivitaComp
      :attivita="$store.getters.attivita"
      :sessioni="$store.getters.sessioni"
      @cambia="setAttivita($event)"
    ></AttivitaComp>
    <Timer :tempoStr="tempoStr" :perc="percFinito"></Timer>
    <button v-show="!inCorso" @click="inizia()">Start</button
    ><button v-show="inCorso" @click="ferma()">Stop</button>
    <button @click="saltaPuntoLavoro()">Salta</button>
  </main>
</template>

<script>
// @ is an alias to /src
import { default as pomoStore, statoStoragek } from "@/js/pomo-store.js";
import date from "@/webApp/js/date.js";
import { faiIlLogin } from "@/login/js/login.js";
import { mandaAlServer } from "@/js/main.js";
import Notizie from "@/js/notificazioni.js";
import Attivita from "@/js/attivita.js";

import Notif from "@/components/notif.vue";
import Timer from "@/components/timer.vue";
import AttivitaComp from "@/components/attivita.vue";
import IndicatoreDiStato from "@/components/indicatoreDiStato.vue";

export default {
  name: "Home",
  components: {
    Notif,
    Timer,
    IndicatoreDiStato,
    AttivitaComp
  },
  store: pomoStore,
  computed: {
    tempoStr() {
      const minuti = Math.floor(this.$store.getters.tempo / 60);
      return date.aggZeri(
        minuti + ":" + (this.$store.getters.tempo - minuti * 60),
        [2],
        ":"
      );
    },
    percFinito() {
      return (
        100 -
        (this.$store.getters.tempo / this.$store.getters.durataTimer) * 100
      );
    },
    sessioniStr() {
      return this.$store.getters.sessioni.map(s =>
        new Date(s["iniziatoT"]).toLocaleString()
      );
    },
    inCorso() {
      return !this.$store.getters.finito;
    },
    eInPausa() {
      // Se il punto lavoro e una pausa
      return this.$store.getters.eInPausa;
    },
    ePausaLunga() {
      // focus (0) pause (1) focus pause focus pause focus pausa-lunga (7)
      return this.$store.getters.ePausaLunga;
    },
    eDarkMode() {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
  },
  methods: {
    init() {
      // this.caricaStato();
      this.chiediServer();
      this.impostiTimer();
      this.autoRiprendi();
    },
    chiediServer() {
      if (this.modifNonSalvate) {
        return;
      }
      this.richiedi("chiedi");
    },
    richiedi(action, payload) {
      mandaAlServer(action, payload, this.loadServerTimer);
    },
    loadServerTimer(timerStato) {
      // Is called everytime an server-interaction occurs
      console.log("Merger med: ", timerStato); // { iniziatoT: "0", durataTimer: "0", puntoLavoro: "0", finito: "1" }

      if (timerStato.iniziatoT) {
        this.$store.commit("iniziatoT", parseInt(timerStato.iniziatoT));
      }
      if (timerStato.durataTimer) {
        this.$store.commit("durataTimer", parseInt(timerStato.durataTimer));
      }
      if (timerStato.puntoLavoro) {
        this.$store.commit("puntoLavoro", parseInt(timerStato.puntoLavoro));
      }
      if (typeof timerStato.finito !== "undefined") {
        this.$store.commit(
          "finito",
          timerStato.finito === true || parseInt(timerStato.finito) === 1
            ? true
            : false
        );
      }
      if (timerStato.sesDati) {
        this.$store.commit(
          "sesDati",
          typeof timerStato.sesDati === "string"
            ? JSON.parse(timerStato.sesDati)
            : timerStato.sesDati
        );
      }
      if (timerStato.attivita) {
        const attivitaArr =
          typeof timerStato.attivita === "string"
            ? JSON.parse(timerStato.attivita)
            : timerStato.attivita;
        this.$store.commit("attivitaArr", attivitaArr);
      }

      this.autoRiprendi();
    },
    inizia() {
      this.impostiTimer();
      this.$store.commit("iniziatoT", Date.now());
      this.$store.commit("finito", false);

      this.riprendi(); // Varetages også af loadServerTimer()

      this.richiedi("inizia", { iniziatoT: this.$store.getters.iniziatoT });
    },
    impostiTimer() {
      // Imposta il timer allo prossimo intervallo
      this.$store.commit("impostiTimer");
    },
    riprendi() {
      this.inizTimer();
    },
    autoRiprendi() {
      this.impostiTimer();
      if (this.$store.getters.iniziatoT && !this.$store.getters.finito) {
        this.riprendi();
      }
    },
    ferma() {
      // Solo usato da buttone
      this.fermaTimer();
      this.$store.commit("iniziatoT", 0);
      this.impostiTimer();
      this.$store.commit("finito", true);

      this.richiedi("ferma");
      /* mandaAlServer("api/sinc/", {
                          iniziatoT: this.iniziatoT,
                          durataTimer: this.durataTimer,
                          puntoLavoro: this.puntoLavoro,
                          finito: true
                      }); */
    },
    prossimoPunto() {
      this.$store.commit("prossimoPunto");
    },
    saltaPuntoLavoro() {
      this.$store.commit("finito", true);
      this.prossimoPunto();

      this.richiedi("salta");
    },
    inizTimer() {
      this.ticTimer();
    },
    fermaTimer() {
      if (this.tHandle) {
        clearTimeout(this.tHandle);
      }
    },
    ticTimer() {
      if (this.$store.getters.finito) {
        // Gia concluso - ticTimer() viene eseguita anche dopo fermaTimer()
        return;
      }
      this.$store.commit(
        "tempo",
        this.$store.getters.durataTimer -
          Math.round((Date.now() - this.$store.getters.iniziatoT) / 1000)
      );
      if (this.$store.getters.tempo <= 0) {
        /* BUG: jeg har problemer med at nogle gange fra overgang fra pause til focus, rammer koden her og tempo er negativ og timeren stopper (uden at det afspejles i UI men bliver sendt til serveren) */
        this.concludiIntervallo();
        return;
      }
      this.tHandle = setTimeout(this.ticTimer, 500);
    },
    concludiIntervallo() {
      this.fermaTimer();
      this.registraSessione(); // Skal køres FØR prossimoPunto()
      this.$store.commit("finito", true);
      const n = new Notizie();
      n.mandi(
        "Pomo d'oro",
        "Your " +
          (this.eInPausa ? "pause" : "focus session") +
          " is done. " +
          "Get ready to " +
          (this.eInPausa ? "study" : "take a break!")
      );
      this.prossimoPunto();

      // this.salvaStato("iniziatoT", (this.iniziatoT = 0));
      this.impostiTimer();
    },
    registraSessione() {
      this.$store.commit("registraSessione");
    },
    inizStato() {
      this.stato = this.std_stato;
      localStorage.setItem(this.storagek, JSON.stringify(this.stato));
    },
    salvaStato(chiave, val) {
      this.stato[chiave] = val;
      localStorage.setItem(this.storagek, JSON.stringify(this.stato));
    },
    setAttivita(attivita) {
      this.$store.commit("attivita", attivita);
      this.richiedi("attivita", {
        attivita: Attivita.toArray(this.$store.getters.attivita)
      });
    },
    caricaStato() {
      this.autoRiprendi();
    },
    riazzera() {
      localStorage.removeItem(statoStoragek);
      location.reload();
    }
  },
  created() {
    faiIlLogin(
      function() {
        this.init();
      }.bind(this),
      "https://dechiffre.dk/"
    );

    let blurT;
    window.addEventListener("blur", () => {
      blurT = Date.now();
      this.blurred = true;
    });
    window.addEventListener("focus", () => {
      this.blurred = false;
      if (blurT - Date.now() > 30 * 60) {
        this.chiediServer();
      }
    });
  },
  data() {
    return {
      tHandle: undefined,
      blurred: false,
      modifNonSalvate: false
    };
  }
};
</script>
