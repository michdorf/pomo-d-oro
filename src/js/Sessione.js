import Attivita from "./attivita.js";

/**
  @param durata i minutter
  @returns Sessione objekt
*/
function Sessione(iniziatoT, puntoLavoro, durata, attivita) {
  const params = ["iniziatoT", "puntoLavoro", "durata", "attivita"];
  this.iniziatoT = iniziatoT;
  this.attivita = attivita;
  this.puntoLavoro = puntoLavoro; // Man kan diskutere om det er relevant at gemme i sessionen, da en session består af 1xfocus og 1xpause
  this.durata = durata;

  /**
   * Returns data as saved in DB
   * NB. iniziatoT e' senza millisecondi
   */
  this.data = function() {
    return [
      Math.round(this.iniziatoT / 1000),
      this.puntoLavoro,
      this.durata,
      Attivita.toArray(this.attivita)
    ];
  };

  this.get = function getSessioneParam(param) {
    const inx = params.indexOf(param);
    if (inx === -1) {
      return null;
    }
    return this[params[inx]];
  };
}

Sessione.fromArray = function(arr) {
  /* NB. iniziatoT e' senza millisecondi  */
  return new Sessione(
    arr[0] * 1000,
    arr[1],
    arr[2],
    arr[3] ? Attivita.fromArray(arr[3]) : undefined
  );
};

export default Sessione;
