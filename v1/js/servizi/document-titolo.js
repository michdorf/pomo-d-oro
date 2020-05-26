/**
* Controlla e aggiorna il titolo del documento
*/
suAppPronto(function (app) {
  var ultfinito = false;
  app.$store.subscribe((mutation, state) => {
    if (state.finito === true) {
      if (ultfinito !== true) {
        document.title = "Pomo d'oro";
        ultfinito = state.finito;
      }
      return;
    }

    document.title = app.tempo_str + " prima del" + (app.e_in_pausa ? " focus" : "la pausa");
  });
});
