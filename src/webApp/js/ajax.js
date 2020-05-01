/* eslint-disable */
if (typeof mich == "undefined")
 var mich = {};

var debug_ajax = false;
function michAjaxClass(JSON_sets) {

 //Standard funktioner til respons
 var onerror = function(motivazione,url){console.error("Ajax-kaldet kunne ikke køre: "+motivazione+" ("+url+")")};
 var onsucces = function(data){console.log("Succesful ajax-call "+data)};

 function ajaxDebug(mes) {
  if (debug_ajax)
   console.log(mes);
 }

 function ajaxPagina(JSON_sets) {

  var timeoutSekunder = JSON_sets.timeout ? JSON_sets.timeout : 6;

  var url = (JSON_sets.url) ? JSON_sets.url : window.location;
  var postvars = "";
  if (JSON_sets.postvars)
   postvars = convert_postvars(JSON_sets.postvars);

  /*var online = true;
   if (mich.linea.inlinea != undefined)
   online = mich.linea.inlinea;
   else if (navigator && navigator.onLine == false)
   online = false;
   if (online == false){
   if (JSON_sets.onerror)
   JSON_sets.onerror("offline",url);
   else
   onerror("offline",url);
   return false;
   }*/

  //Skab ajax-objektet
  var ajaxReq = new XMLHttpRequest();
  if (postvars != "")
   ajaxReq.open("POST", url, true);
  else
   ajaxReq.open("GET", url, true);

  if (typeof JSON_sets.withCredentials !== 'undefined') {
    ajaxReq.withCredentials = JSON_sets.withCredentials;
  }

  if (JSON_sets.dataType) {
   var dataType = JSON_sets.dataType.toLowerCase();
   switch (dataType) {
    case "json":
     ajaxReq.setRequestHeader("Content-type", "application/json");
     break;
    case "ajax":
    default:
     ajaxReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   }
  } else
   ajaxReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  ajaxReq.onreadystatechange = function ajax_call_ready() {
   if (ajaxReq.readyState == 4) {
    if (ajaxReq.status == 200){
     success = true;
     var resp = ajaxReq.responseText.trim();
     //resp = resp.replace(/"/g,'');

     if (resp.substring(0, 7) == "Errore:")
      ajaxDebug("m().ajax(" + url + "):\n" + resp);
     else {
      var stdFunktion = onsucces;
      var funkt = JSON_sets.run ? JSON_sets.run : stdFunktion;
      funkt(resp);
     }
    }//Status-code var ikke 200 = dokument ikke tilgængeligt
    else{
     if (JSON_sets.onerror)
      JSON_sets.onerror("non accessibile",url);
     else
      onerror("non accessibile",url);
     ajaxReq.abort();
     if (intervalHDL){clearInterval(intervalHDL);}
    }
   }
  };

  if (postvars != "")
   ajaxReq.send(postvars);
  else
   ajaxReq.send();

  var success = false;
  var antalSekunderSendt = 0;
  var intervalHDL = setInterval(function () {
   if (!success) {
    //console.info("Der er gået "+antalSekunderSendt+" sek");
    antalSekunderSendt++;
    if (antalSekunderSendt > timeoutSekunder) {
     ajaxDebug("m().ajax(" + url + "):\nAjax-kaldet har ikke fået svar. Måske er du offline.\nTjek din forbindelse!");
     if (JSON_sets.onerror)
      JSON_sets.onerror("tempo scaduto",url);
     else
      onerror("tempo scaduto",url);
     ajaxReq.abort();
     clearInterval(intervalHDL);
    }
   } else {
    clearInterval(intervalHDL);
   }
  }, 1000);
 } //funktion mAjax.ajax() slut

 ajaxPagina(JSON_sets);
 return this;
}

function convert_postvars(postvars) {
  if (typeof postvars === undefined) {
    return '';
  } else if (typeof postvars === 'object') {
    var r = [];
    for (var key in postvars) {
      r.push(key + '=' + postvars[key]);
    }
    return r.join("&");
  } else {
    return postvars;
  }
}

mich.Ajax = michAjaxClass;

export default michAjaxClass;
export {michAjaxClass as ajax}