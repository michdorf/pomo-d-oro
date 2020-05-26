<?php
/**
 * Der skal være en concludi intervallo:
 *      Ligesom JS pendant (husk Sessione formattering)
 *      Husk selv at springe til prossimo punto
 * Der skal være mulighed for:
 *  1. starte interval
 *  2. stoppe interval
 *  3. springe interval over
 *  4. indstille attivita
 */
include_once "../../../ins/php/basic.php";
include_once "../../../ins/php/connettiDB.php";
include_once "../../../ins/php/crypt.php";
include_once "../../../ins/php/string.php";
include_once "../../../ins/php/debug.php";
include_once "../../../ins/php/login.php";
include_once "../../../ins/php/tabella.class.php";
include_once "../pomoOro.tabella.php";
include_once "../../php/Sessione.php";
include_once "../../php/Attivita.php"; /* Ikke i brug pt. */
include_once "../../php/helper.php";

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: *');

$response = array("msg" => "", "stato" => "successo", "data"=>"", "successo" => true);

$action = ifpost("action");
$payload = get_payload();

if (!$action) {
    $response["msg"] = "POST action non definita";
    $response["stato"] = "errore";
    $response["successo"] = false;
    exit(json_encode($response));
}

$logged = checkLogin();
$identi = ricIdenti();
if (!$logged || !$identi)  {
    mandi_errore("non entrato", $response);
}

$oro = seleziona_timer($identi);
$response["timerStato"] = $oro;
$esito = get_timer_esito();

if (!$oro['pausaLungaDopo']) { // Se non definita imposti default
    $oro['pausaLungaDopo'] = 4;
}

$oro = auto_concludi($oro);

if ($payload) {
    $response["payload"] = $payload;
}

switch ($action) {
    case 'inizia':
        // Inizia timer
        $iniziatoT = $payload['iniziatoT'];
        if (!$iniziatoT) {
            mandi_errore('iniziatoT non definito', $response);
        }
        $oro['iniziatoT'] = $iniziatoT;
        $oro['finito'] = false;
        $oro = imposti_timer($oro);
    break;
    case 'ferma':
        $oro['finito'] = true;
    break;
    case 'salta':
        $oro = prossimo_punto($oro);
        $oro = imposti_timer($oro);
    break;
    case 'attivita':
        if (!isset($payload["attivita"])) {
            mandi_errore("attivita non definita", $response);
        }
        $oro["attivita"] = $payload["attivita"];
    break;
    case 'chiedi':
    default:
        
}

$payload['utente'] = $pomoOroTabella->pulisci($identi);
$response["timerStato"] = array_merge($payload, $oro); // Overskriv $payload med $oro

if ($esito->num_rows) {
  $whereUtente = get_whereUtente();
  $pomoOroTabella->update($oro, $whereUtente);
  $response["msg"] = "aggiornato";
}else {
  $pomoOroTabella->inserisci($oro);
  $response["msg"] = "inserito";
}
echo json_encode($response);
