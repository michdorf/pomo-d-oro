var ambienti = {
  debug: {
    debug: true,
    std_stato: {
      tempi: [0.4, 0.25, 1],
      pausa_lunga_dopo: 4,
      ses_dati: []
    },
  },
  produzione: {
    debug: false,
    std_stato: {
      tempi: [25, 5, 15],
      pausa_lunga_dopo: 4,
      ses_dati: []
    },
  }
};
var ambiente = ambienti.produzione;
