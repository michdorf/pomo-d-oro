function Attivita(id, testo, progetto) {
  this.id = id || 1;
  this.testo = testo || "";
  this.progetto = progetto || "vita";
}

Attivita.toArray = function (attivita) {
  return [attivita.id, attivita.testo, attivita.progetto];
}

Attivita.fromArray = function (attivita_arr) {
  return new Attivita(attivita_arr[0], attivita_arr[1], attivita_arr[2]);
}
