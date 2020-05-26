<?php
/**
*  @param durata i minutter
*  @returns Sessione objekt
*/
class Sessione {
  public $iniziatoT;
  public $puntoLavoro;
  public $durata;
  public $attivita;
  private $params = array("iniziatoT", "puntoLavoro", "durata");

  // TODO: skal matche JS version OG tage stilling til iniziatoT uden millisekunder
  function __construct($iniziatoT, $puntoLavoro, $durata, $attivitaArray) {
    $this->iniziatoT = $iniziatoT;
    $this->puntoLavoro = $puntoLavoro;
    $this->durata = $durata;
    $this->attivitaArray = $attivitaArray;
  }

  /**
  * Returns data as saved in DB
  * NB. iniziatoT e' senza millisecondi
  */
  // TODO: skal matche JS version OG tage stilling til iniziatoT uden millisekunder
  public function data() {
    return [round($this->iniziatoT/1000), $this->puntoLavoro, $this->durata, $this->attivitaArray];
  }

  public function get($param) {
    $inx = array_search($param, $this->params);
    if ($inx === FALSE) {return NULL;}
    return $this->{$this->params[$inx]};
  }

  static function fromArray($arr) {
    return new Sessione($arr[0], $arr[1], $arr[2]);
  }
}
