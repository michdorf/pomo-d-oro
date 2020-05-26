Vue.component('app-timer', {
  props: ['perc', 'tempo_str'],
  data() {
    return {
      quadrante_size: 280
    }
  },
  computed: {
  },
  template: `
    <div style="position: relative; text-align: center">
      <div class="timer" style="position: absolute; height: 1em; width: 100%; text-align: center" :style="{'top': 'calc(' + (quadrante_size / 2) + 'px - 0.6em)'}">
        {{tempo_str}}
        <div style="font-size: initial">
          <app-ora-completamento :iniziato_t="$store.getters.iniziato_t" :durata_timer="$store.getters.durata_timer" :in_corso="!$store.getters.finito"></app-ora-completamento>
        </div>
      </div>
      <app-quadrante :perc="perc" :canvas_size="quadrante_size"></app-quadrante>
    </div>
  `
})
