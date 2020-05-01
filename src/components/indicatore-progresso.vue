<template>
  <div>
      <app-cerchi :n_fatte="cerchi.fatte" :tempo="cerchi.c_tempo" :obbiettivo="obbiettivo" :durataTimer="durataTimer"></app-cerchi>
      <app-linee :linee="linee"></app-linee>
    </div>
</template>

<script>
export default {
  name: "indicatore-progresso",
props: ["inCorso", "tempo", "durataTimer", "sessioni", "obbiettivo", "pausaLungaDopo"],
  computed: {
    ses_oggi() {
      var oggi = new Date();
      var t_start = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()).getTime();
      var t_fine = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()+1).getTime();
      return this.sessioni.filter((ses) => (ses.iniziatoT >= t_start && ses.iniziatoT < t_fine));
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
        c[ci] += 100 / this.pausaLungaDopo;
      }

      while (c.length < this.obbiettivo) {
        c.push(0);
      }
      return c;
    },
    cerchi() {
      var n_ses = this.ses_oggi.length;
      return {fatte: n_ses, c_tempo: (this.inCorso ? this.tempo : null)};
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
        l[li] += 100 / this.pausaLungaDopo;
      }

      if (this.inCorso) {
        let t_rimarente = this.durataTimer - this.tempo;
        l[li] += ((t_rimarente / this.durataTimer) * (1 / this.obbiettivo)) * 100;
      }

      while (l.length < this.obbiettivo) {
        l.push(0);
      }
      return l;
    }
  }
}
</script>
