<?php
$timerEsito;
$whereUtente;

function seleziona_timer($identi) {
  global $pomoOroTabella, $timerEsito, $whereUtente;
  $whereUtente = new WhereClause("utente", $identi);
  $esito = $pomoOroTabella->seleziona(["iniziatoT","durataTimer","pausaLungaDopo","puntoLavoro","attivita","sesDati","finito"], $whereUtente);
  $oro = $esito->fetch_assoc();
  if (!$esito->num_rows) {
    $oro = [];
  }

  $oro['puntoLavoro'] = intval($oro['puntoLavoro']);
  $oro['pausaLungaDopo'] = intval($oro['pausaLungaDopo']);

  $timerEsito = $esito;
  return $oro;
}

function mandi_errore($msg, &$response) {
  http_response_code(400); // BAD REQUEST
  $response["msg"] = $msg;
  $response["timerStato"] = array();
  $response["stato"] = "errore";
  $response["successo"] = false;
  exit(json_encode($response));
}

function imposti_timer($oro) {
  $e_in_pausa = e_in_pausa($oro);
  // focus (0) pause (1) focus pause focus pause focus pausa-lunga (7)
  $e_pausa_lunga = ($oro['puntoLavoro'] === (($oro['pausaLungaDopo'] * 2) - 1));
  $punto_inx = ($e_pausa_lunga) ? 2 : ($e_in_pausa ? 1 : 0);
  $tempi = get_tempi();
  $oro['durataTimer'] = $tempi[$punto_inx] * 60;
  return $oro;
}

function prossimo_punto($oro) {
  $oro['puntoLavoro'] += 1;
  if ($oro['puntoLavoro'] >= ($oro['pausaLungaDopo'] * 2)) {
    $oro['puntoLavoro'] = 0;
  }
  $oro['finito'] = true;
  $oro = imposti_timer($oro);
  return $oro;
}

function auto_concludi($oro) {
  if ($oro['finito']) {
    return $oro;
  }
  $e_scaduto = ((round($oro["iniziatoT"] / 1000) + $oro["durataTimer"]) < time());
  if (!$e_scaduto) {
    return $oro;
  }
  $oro = registra_sessione($oro); // Skal køres FØR prossimo_punto()
  $oro['finito'] = true;
  $oro = prossimo_punto($oro);
  return $oro;
}

function get_timer_esito() {
  global $timerEsito;
  return $timerEsito;
}

function get_whereUtente(){
  global $whereUtente;
  return $whereUtente;
}

function get_payload() {
  global $_POST;
  if (isset($_POST["payload"])) {
    try {
      $payload = json_decode($_POST["payload"], true); // iniziatoT, durataTimer, puntoLavoro, evt. finito
      return $payload;
    } catch (Exception $e) {
      throw $e;
    }
  } else {
    return "";
  }
}

function get_tempi() {
  $debug = false;
  if ($debug) {
    return [0.5, 0.25, 1];
  }
  return [25, 5, 15];
}

function e_in_pausa($oro) {
  $oro['puntoLavoro'] = intval($oro['puntoLavoro']);
  return (($oro['puntoLavoro'] % 2) === 1);
}

function registra_sessione($oro) {
  if (e_in_pausa($oro)) { // Non registrare una pausa come un sessione
    return $oro;
  }
  if ($oro['attivita']) {
    $attivitaArray = json_decode($oro['attivita']);
  } else {
    $a = new Attivita();
    $attivitaArray = $a->toArray();
  }
  $oro['attivita'] = $attivitaArray;
  if (!$oro['sesDati']) {
    $oro['sesDati'] = '[]';
  }
  $sessione = new Sessione($oro['iniziatoT'], $oro['puntoLavoro'], $oro['durataTimer'], $attivitaArray);
  $sesDati = json_decode($oro['sesDati']);
  array_push($sesDati, $sessione->data());
  $oro['sesDati'] = $sesDati;
  return $oro;
}

/** 
 * IKKE i brug i v2 af API
*/
function merge_sessioni($db, $client) {
  if (!is_array($db)) {
    $db = array();
  }
  foreach ($client as $c_arr) {
    $c_ses = Sessione::fromArray($c_arr);
    $essiste = FALSE;
    foreach ($db as $db_arr) {
      $db_ses = Sessione::fromArray($db_arr);
      if ($c_ses->get("iniziatoT") === $db_ses->get("iniziatoT")) {
        $essiste = TRUE;
        break;
      }
    }

    if (!$essiste) {
      array_push($db, $c_arr);
    } else {
      /* print_r($c_arr);
      echo(" findes allerede i ");
      print_r($db); */
      continue;
    }
  }

  return $db;
}
