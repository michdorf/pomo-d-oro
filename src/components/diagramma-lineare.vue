<script>
/*
 1. Sessioner pr. dag
*/
var diagLineChart;

export default {
  name: "Diagramma-Lineare",
  props: ["sessioni"],
  data() {
    return {
    }
  },
  watch: {
    sessioni() {
      let s = this.sessioni_pro_giorno().n;
      diagLineChart.updateSeries([{data: s}]);
    }
  },
  methods: {
    sessioni_pro_giorno() {
      var ses = this.sessioni; //.map(ses => date.datastr(ses.iniziatoT, "giornodata"));
      var data_cor = "", giorno = 0, giorni = [];
      var nn = [];
      for (var i = 0; i < ses.length;) {
        giorno = 0;
        data_cor = date.datestamp(ses[i].iniziatoT);
        giorni.push(date.datastr(ses[i].iniziatoT, true));
        while (i < ses.length && data_cor === date.datestamp(ses[i].iniziatoT)) {
          giorno++;
          i++;
        }
        nn.push(giorno);
      }

      return {
        n: nn,
        giorni: giorni
      }
    },
    diagramma_lineare() {
      let sessioni_pro_giorno = this.sessioni_pro_giorno();
      var options = {
          series: [{
            name: 'Sessioni',
            data: sessioni_pro_giorno.n
          }],
          chart: {
            height: 350,
            type: 'bar',
          },
          /* plotOptions: {
            bar: {
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            }
          },
          dataLabels: {
            enabled: true,
            offsetY: -10,
            style: {
              fontSize: '12px',
              colors: ["#304758"]
            }
          },*/
          theme: {
            mode: this.$root.eDarkMode ? 'dark' : 'light'
          },

          xaxis: {
            categories: sessioni_pro_giorno.giorni,
            /*position: 'top',
            axisBorder: {
              show: false
            },
            zoom: {
              enabled: true,
              type: 'x',
              resetIcon: {
                offsetX: -10,
                offsetY: 0,
                fillColor: '#fff',
                strokeColor: '#37474F'
              },
              selection: {
                background: '#90CAF9',
                border: '#0D47A1'
              }*/
            },
            /*axisTicks: {
              show: false
            },
            crosshairs: {
              fill: {
                type: 'gradient',
                gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
                }
              }
            },
            tooltip: {
              enabled: true,
            }
          },
          yaxis: {
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              formatter: function (val) {
                return val;
              }
            }

          },*/
          title: {
            text: 'Sessioni pro giorno',
            /*floating: true,
            offsetY: 330,*/
            align: 'center',
            style: {
              color: this.$root.eDarkMode ? 'white' : '#444'
            }
          }
        };

        diagLineChart = new ApexCharts(this.$el, options);
        diagLineChart.render();
    }
  },
  mounted() {
    this.diagramma_lineare();
  }
}
</script>




Vue.component("app-diagramma-lineare", 
}

<template>
  <div class="diagramma_lineare"></div>
</template>