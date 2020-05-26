<?php
include_once "../../../ins/php/basic.php";
include_once "../../../ins/php/connettiDB.php";
include_once "../../../ins/php/crypt.php";
include_once "../../../ins/php/string.php";
include_once "../../../ins/php/debug.php";
include_once "../../../ins/php/login.php";
include_once "../../../ins/php/tabella.class.php";
include_once "../pomoOro.tabella.php";
include_once "../../php/helper.php";

$response = array("msg" => "", "stato" => "successo", "data"=>"", "successo" => true);

$logged = checkLogin();
$identi = ricIdenti();
if (!$logged || !$identi)  {
  $response = array("msg" => "non entrato", "timerStato"=>array(), "stato" => "errore", "successo" => false);
  exit(json_encode($response));
}

$timerstato = seleziona_timer($identi);
$response["timerStato"] = $timerstato;
$timeresito = get_timer_esito();
$sessioni = get_payload();

if ($sessioni) {
  if (!is_array($timerstato["sessioni"])) {
    $timerstato["sessioni"] = array();
  }
  $sessioni = merge_sessioni($timerstato["sessioni"], $sessioni);
  $response["timerStato"]["sessioni"] = $sessioni;

  $payload = array("sessioni" => $sessioni);
  if ($timeresito->num_rows) {
    $whereUtente = get_whereUtente();
    $pomoOroTabella->update($payload, $whereUtente);
    $response["msg"] = "aggiornato";
  }else {
    $pomoOroTabella->inserisci($payload);
    $response["msg"] = "inserito";
  }

  echo json_encode($response);
} else {
  $response = array_merge($response, array("msg" => "sessioni non definita", "stato" => "errore", "successo" => false));
  echo json_encode($response);
}

function merge_sessioni($db, $client) {
  foreach ($client as $value) {
    if (array_search($value, $db) === FALSE) {
      array_push($db, $value);
    }
  }

  return $db;
}
