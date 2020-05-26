/*
 2. Sessioner på timetal af dagen
*/
var diagOretChart;
Vue.component("app-diagramma-orette", {
  props: ["sessioni"],
  data() {
    return {
      /* debug: new Array(), */
      intervalli: [0,6,8,10,12,14,16,18,20,22] // Skal helst stå nummerisk opstillet
    }
  },
  watch: {
    sessioni() {
      let s = this.sessioni_pro_oretta().n;
      diagOretChart.updateSeries([{data: s}]);
    }
  },
  methods: {
    sessioni_pro_oretta() {
      var ses = this.sessioni; //.map(ses => date.datastr(ses.iniziato_t, "giornodata"));
      var intervalli = this.intervalli;
      var orette = new Array(intervalli.length).fill(0);
      var ora = 0;
      var nn = [];
      for (var i = 0, j = 0; i < ses.length; i++) {
        ora = new Date(ses[i].iniziato_t).getHours();
        j = 0;
        while (ora >= intervalli[j]) {
          j++;
        }
        j--; // Ryk én tilbage (der hvor ora > intervalli[j])
        if (!orette[j]) {
          orette[j] = 0;
        }
        /* if (typeof this.debug[j] === "undefined") {
          Vue.set(this.debug, j, []);
        }
        this.debug[j].push(ora + ":" + new Date(ses[i].iniziato_t).getMinutes()); */
        orette[j] += 1;
      }

      return {
        n: orette,
        orette: intervalli.map((start, inx, arr) => arr[inx] + ":00-" + (inx === (arr.length - 1) ? arr[0] : arr[inx+1]) + ":00")
      }
    },
    diagramma_lineare() {
      let sessioni_pro_oretta = this.sessioni_pro_oretta();
      var options = {
          series: [{
          name: 'Sessioni',
          data: sessioni_pro_oretta.n
        }],
        chart: {
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        theme: {
          mode: this.$root.e_dark_mode ? 'dark' : 'light'
        },
        title: {
          text: 'Sessioni ogni ora',
          /*floating: true,
          offsetY: 330,*/
          align: 'center',
          style: {
            color: this.$root.e_dark_mode ? 'white' : '#444'
          }
        },
        /* stroke: {
          curve: 'smooth'
        },*/
        xaxis: {
          /*type: 'datetime',*/
          categories: sessioni_pro_oretta.orette
        },
        /*tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          },
        },*/
        };

        diagOretChart = new ApexCharts(this.$el, options);
        diagOretChart.render();
    }
  },
  mounted() {
    this.diagramma_lineare();
  },
  template: `
    <div class="diagramma_orette"></div>
  `
})
