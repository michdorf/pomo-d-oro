function Attivita(id, testo, progetto) {
  this.id = id || 1;
  this.testo = testo || "";
  this.progetto = progetto || "vita";
}

Attivita.toArray = function(attivita) {
  return [attivita.id, attivita.testo, attivita.progetto];
};

Attivita.fromArray = function(attivitaArr) {
  return new Attivita(attivitaArr[0], attivitaArr[1], attivitaArr[2]);
};

export default Attivita;
