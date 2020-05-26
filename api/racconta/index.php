<?php
include_once "../../../ins/php/basic.php";
include_once "../../../ins/php/connettiDB.php";
include_once "../../../ins/php/crypt.php";
include_once "../../../ins/php/string.php";
include_once "../../../ins/php/debug.php";
include_once "../../../ins/php/login.php";
include_once "../../../ins/php/tabella.class.php";
include_once "../pomoOro.tabella.php";
include_once "../../php/Sessione.php";
include_once "../../php/helper.php";

$payload = get_payload();
$sinc_id = isset($payload["sinc_id"]) ? $payload["sinc_id"] : "";

$response = array("msg" => "", "sinc_id" => $sinc_id, "stato" => "successo", "data"=>"", "successo" => true);

$logged = checkLogin();
$identi = ricIdenti();
if (!$logged || !$identi)  {
  $response["msg"] = "non entrato";
  $response["timerStato"] = array();
  $response["stato"] = "errore";
  $response["successo"] = false;
  exit(json_encode($response));
}

$oro = seleziona_timer($identi);
$response["timerStato"] = $oro;
$esito = get_timer_esito();

$response["payload"] = $payload;

if ($payload) {
  $payload["utente"] = $pomoOroTabella->pulisci($identi);
  $force = (isset($payload["force"])) ? !!$payload["force"] : false;
  /* if (isset($payload["finito"])) {
    // Jeg ved ikke om det er vigtigt, da det ser ud til, at PHP godt kan læse bool
    $payload["finito"] = $payload["finito"] === "true" ? 1 : ($payload["finito"] === "false" ? 0 : !!$payload["finito"]);
  }*/

  $in_corso = false;
  if ($esito->num_rows) {
    // Umiddelbart er $oro["finito"] lige meget
    $in_corso = (!$oro["finito"]) && ((round($oro["iniziatoT"] / 1000) + $oro["durataTimer"]) > time());
  }

  if (isset($payload["attivita"])) {
    $response["timerStato"]["attivita"] = $payload["attivita"];
  }

  /* if (sizeof($oro)) {
    if ($in_corso && !$force) {
      if ((isset($payload["iniziatoT"]) && $oro["iniziatoT"] != $payload["iniziatoT"])
          //|| (isset($payload["finito"]) && $oro["finito"] != $payload["finito"])
          || (isset($payload["durataTimer"]) && $oro["durataTimer"] != $payload["durataTimer"])) {
        //if (!$payload["finito"]) {
          $oro["debug"] = $in_corso." : ".(round($oro["iniziatoT"] / 1000) + $oro["durataTimer"])." : ".time()." : ".((round($oro["iniziatoT"] / 1000) + $oro["durataTimer"]) > time());
          $response["msg"] = "gia in corso";
          $response["stato"] = "warn";
          $response["data"] = $oro;
          $response["successo"] = false;
          echo json_encode($response);
          exit;
        //}
      }
    }
  } */
  if (sizeof($oro)) {
    // Vi vil gemme den, hvor sinc_id er nyest
    if (isset($payload["sinc_id"])
        && $oro["sinc_id"] >= $payload["sinc_id"]) { // sinc_id er datestamp + et increment f.eks. 20206221
      $response["timerStato"] = array_merge($payload, $oro); // Overskriv payload med oro
      $response["sinc_id"] = $oro["sinc_id"];
      $response["msg"] = "gia piu recente";
      echo json_encode($response);
      exit;
    }
  }

  if (isset($payload["sesDati"])) {
    if (!is_array($payload["sesDati"])) {
      $payload["sesDati"] = [];
    }
    $payload["sesDati"] = merge_sessioni($response["timerStato"]["sesDati"], $payload["sesDati"]);
    $response["timerStato"]["sesDati"] = $payload["sesDati"];
  }
  $response["timerStato"] = array_merge($oro, $payload);
  $response["sinc_id"] = $response["timerStato"]["sinc_id"];

  if ($esito->num_rows) {
    $whereUtente = get_whereUtente();
    $pomoOroTabella->update($payload, $whereUtente);
    $response["msg"] = "aggiornato";
  }else {
    $pomoOroTabella->inserisci($payload);
    $response["msg"] = "inserito";
  }
  echo json_encode($response);
} else {
  echo json_encode($response);
}
