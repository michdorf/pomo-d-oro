/**
 * Un modo di fare obj = nuovo_obj con vue.js dynamic objects
 * Non rimuove proprietà non presente in nuovo
 * @param Object obj
 * @param Object nuovo
 */
function unisci_vue_oggetti(obj, nuovo) {
  if (Array.isArray(nuovo)) {
    return unisci_vue_array(obj, nuovo);
  }

  for (var key in nuovo) {
    /* if (!obj.hasOwnProperty(key)) {
      console.warn("Il oggetto non ha il property " + key + " non sara sentita da vue.js (unisci_vue_oggetti(obj, nuovo))");
    } */
    Vue.set(obj, key, nuovo[key]);
  }

  return obj;
};

function unisci_vue_array(array, nuovo) {
  for (var i = 0; i < nuovo.length; i++) {
    if (typeof array[i] === "undefined") {
      array.push(nuovo[i]);
    } else {
      unisci_vue_oggetti(array[i], nuovo[i]);
    }
  }
  return;
}
