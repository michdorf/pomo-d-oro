/**
 * I første omgang tænkt som et event-system til asynkrone applikationer
 */
export default function Osservabile() {
  const ascoltatori = [];
  this.senti = function(funz) {
    ascoltatori.push(funz);
  };

  this.prossimo = function(val) {
    for (let i = 0; i < ascoltatori.length; i++) {
      ascoltatori[i](val);
    }
  };
}
