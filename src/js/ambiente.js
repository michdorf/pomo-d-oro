var ambienti = {
  debug: {
    debug: true,
    std_stato: {
      tempi: [0.4, 0.25, 1],
      pausaLungaDopo: 4,
      sesDati: []
    },
  },
  produzione: {
    debug: false,
    std_stato: {
      tempi: [25, 5, 15],
      pausaLungaDopo: 4,
      sesDati: []
    },
  }
};
var ambiente = ambienti.produzione;
