// Kræver sinc og debug
import { mich } from "../../webApp/js/webapp.helper.js";
import debug from "../../webApp/js/debug.js";
/* eslint-disable */

/**
 * Alt i en funktion, som automatisk sørger for viderestilling, når man ikke er logget ind
 * @param {funz} onReady 
 * @param {string} rootAPIUrl hvis du forbinder fra Vue eller Angular server
 */
function fai_il_login(onReady, rootAPIUrl) {
  entri_sul_server(function entrato(entrato) {
    mich.linea.onStatoTrovato(function () {
      if (!entrato && mich.linea.inlinea()) {
        window.location = (rootAPIUrl || '/') + "login.php?redir=" + location.pathname;
      } else {
        if (typeof onReady === "function") {
          onReady(entrato);
        }
      }
    });
  }, rootAPIUrl);
}

function entri_sul_server(onReady, rootAPIUrl) {
  onReady = typeof onReady === "function" ? onReady : function() {};
  var start_d = Date.now();
  var logged = false;

  var log_tic_toc = function(start_d, end_d) {
    var diff = end_d - start_d;
    var diff_secs = Math.round(diff / 1000);
    var msg = "Il sito ha speso " + (diff > 10000 ? diff_secs + "s" : diff + "ms") + " a farti entrare.\n" + (logged ? "Sei entrato" : "Non sei entrato");
    if (diff < 2000) {
      debug.info(msg);
    } else {
      debug.warn(msg);
    }
  }

  var url = (rootAPIUrl || '/') + 'login/api/login_dinamico.php';
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.withCredentials = true; 
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function() {
    // NB. this is xhr
    if (this.readyState == 4) {
      if (this.status == 200) {
        var respstr = xhr.responseText;
        
        var resp = JSON.parse(respstr);
        if (resp.status.trim() === "successo!") {
          logged = true;
        }
        complete();
      }
    }
  };

  xhr.onerror = complete;

  xhr.send();

  function complete() {
    /*global sinc*/
    if (typeof sinc !== "undefined") {
      sinc.riprendi(); // Genstart sinc hvis den er slukket pga. manglende login
    }

    var end_d = Date.now();
    log_tic_toc(start_d, end_d);
    onReady(logged);
  }
}

export {fai_il_login as faiIlLogin};