<?php

class Attivita {
    public $id;
    public $testo;
    public $progetto;

    function __construct($id, $testo, $progetto) {
        $this->id = $id ?: 1;
        $this->testo = $testo ?: '';
        $this->progetto = $progetto ?: 'vita';
    }

    public function toArray() {
        return [$this->id, $this->testo, $this->progetto];
    }
}