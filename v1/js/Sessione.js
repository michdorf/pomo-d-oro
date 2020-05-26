/**
  @param durata i minutter
  @returns Sessione objekt
*/
function Sessione(iniziato_t, punto_lavoro, durata, attivita) {
  var params = ["iniziato_t", "punto_lavoro", "durata", "attivita"];
  this.iniziato_t = iniziato_t;
  this.attivita = attivita;
  this.punto_lavoro = punto_lavoro; // Man kan diskutere om det er relevant at gemme i sessionen, da en session består af 1xfocus og 1xpause
  this.durata = durata;

  /**
  * Returns data as saved in DB
  * NB. iniziato_t e' senza millisecondi
  */
  this.data = function () {
    return [Math.round(this.iniziato_t/1000), this.punto_lavoro, this.durata, Attivita.toArray(this.attivita)];
  }

  this.get = function getSessioneParam(param) {
    var inx = params.indexOf(param);
    if (inx === -1) {return null}
    return this[params[inx]];
  }
}

Sessione.fromArray = function (arr) {
  /* NB. iniziato_t e' senza millisecondi  */
  return new Sessione((arr[0] * 1000), arr[1], arr[2], (arr[3] ? Attivita.fromArray(arr[3]) : undefined));
}
