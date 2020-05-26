<?php
include_once './Attivita.php';
include_once './Sessione.php';
include_once './helper.php';
$oro = Array('iniziatoT'=>time() * 1000, 
                'durataTimer'=>25*60,
                'pausaLungaDopo'=>4,
                'puntoLavoro'=>7,
                'attivita'=>'',
                'sesDati'=>'',
                'finito'=>'0');

$oro = registra_sessione($oro);

// Inizia timer
$iniziatoT = 22;
if (!$iniziatoT) {
    mandi_errore('iniziatoT non definito', $response);
}
$oro['iniziatoT'] = $iniziatoT;
$oro['finito'] = false;
$oro = imposti_timer($oro);

echo json_encode($oro);