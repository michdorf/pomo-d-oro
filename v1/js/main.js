function modifiche_non_salvate(vero) {
  if (typeof vero !== "undefined") {
    if (!vero) {
      setTimeout(function () {
        APP.modif_non_salvate = !!vero;
      }, 250);
    } else {
      APP.modif_non_salvate = !!vero;
    }
  }
  return APP.modif_non_salvate;
}

function mandaAlServer(url, payload) { // Håndterer i første omgang /api/inzia/
    var query = payload ? "payload=" + JSON.stringify(payload) : "";
    axios.post(url, query).then(function (response) {
        var r = response.data;
        var payload = !payload && response.config.data
                      ? JSON.parse(response.config.data.split("payload=")[1])
                      : (payload || "");
        var url = response.config.url;
        if (r.stato === "errore") {
          handleError(r);
          return false;
        }
        if (r.stato === "warn") {
          handleWarn(r, url, payload);
          return false;
        }
        if (r.msg === "gia piu recente") {
          errori_osserv.prossimo(r);
          // alert("Gia un piu recente\n\nPayload\n" + JSON.stringify(payload) + "\n\nServer stato:\n" + JSON.stringify(r));
        } else {
          // alert("Må gerne overskrive\nClient sinc_id: "+ payload.sinc_id+"\nServer sinc_id: "+r.sinc_id);
          errori_osserv.prossimo("Må gerne overskrive\nClient sinc_id: "+ payload.sinc_id+"\nServer sinc_id: "+r.sinc_id);
        }
        if (r.timerStato) {
          APP.loadServerTimer(r.timerStato, r.sinc_id);
        }
      })
      .catch(function (error) {
        errori_osserv.prossimo(error);
        console.log(error);
      });
}

function handleError(response) {
  var r = response;
  if (r.msg === "non entrato") {
    fai_il_login();
    return;
  }
  // alert("Errore: \n"+r.msg);
  errori_osserv.prossimo(r.msg);
  console.error(r.msg);
}

function handleWarn(r, url, payload) {
  if (r.msg === "gia in corso") {
    if (confirm(t("Timer gia in corso\nVuoi continuare?"))) {
      payload.force = true;
      // payload.sinc_id = ""; // Ingen sinc_id => overskrivning i loadServerTimer()
      mandaAlServer(url, payload);
    } else {
      APP.loadServerTimer(r.timerStato); // Overskriv med server-version
    }
  }
}
