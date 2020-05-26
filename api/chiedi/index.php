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
$response["sinc_id"] = $oro["sinc_id"];
$esito = get_timer_esito();

echo json_encode($response);
