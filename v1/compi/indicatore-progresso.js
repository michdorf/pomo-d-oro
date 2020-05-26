Vue.component("app-indicatore-progresso", {
  props: ["in_corso", "tempo", "durata_timer", "sessioni", "obbiettivo", "pausa_lunga_dopo"],
  computed: {
    ses_oggi() {
      var oggi = new Date();
      var t_start = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()).getTime();
      var t_fine = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()+1).getTime();
      return this.sessioni.filter((ses) => (ses.iniziato_t >= t_start && ses.iniziato_t < t_fine));
    },
    _non_in_uso_cerchi() {
      var c = [0];
      var n_ses = this.ses_oggi.length;
      var ci = 0;
      for (var i = 0; i < n_ses; i++) {
        if (c[ci] >= 100) {
          ci++;
          c.push(0);
        }
        c[ci] += 100 / this.pausa_lunga_dopo;
      }

      while (c.length < this.obbiettivo) {
        c.push(0);
      }
      return c;
    },
    cerchi() {
      var n_ses = this.ses_oggi.length;
      return {fatte: n_ses, c_tempo: (this.in_corso ? this.tempo : null)};
    },
    linee() {
      var l = [0];
      var n_ses = this.ses_oggi.length;
      var li = 0;
      for (var i = 0; i < n_ses; i++) {
        if (l[li] >= 100) {
          li++;
          l.push(0);
        }
        l[li] += 100 / this.pausa_lunga_dopo;
      }

      if (this.in_corso) {
        let t_rimarente = this.durata_timer - this.tempo;
        l[li] += ((t_rimarente / this.durata_timer) * (1 / this.obbiettivo)) * 100;
      }

      while (l.length < this.obbiettivo) {
        l.push(0);
      }
      return l;
    }
  },
  template: `
    <div>
      <app-cerchi :n_fatte="cerchi.fatte" :tempo="cerchi.c_tempo" :obbiettivo="obbiettivo" :durata_timer="durata_timer"></app-cerchi>
      <app-linee :linee="linee"></app-linee>
    </div>
  `
})
