<?php
$pomoOroTabella = new Tabella("pomoOro");
$pomoOroTabella->agg_campi(
  new Campo("id", 16, CampoTipo::INT, [ExtraCampoTipo::PRIMARY_KEY, ExtraCampoTipo::AUTO_INCREMENT]),
  new Campo("utente", 18, CampoTipo::INT),
  new Campo("iniziatoT", 18, CampoTipo::BIGINT),
  new Campo("durataTimer", 12, CampoTipo::INT),
  new Campo("pausaLungaDopo", 2, CampoTipo::INT),
  new Campo("puntoLavoro", 1, CampoTipo::INT),
  new Campo("attivita", 900, CampoTipo::VARCHAR), /* skal egentlig være en array på string format */
  new Campo("sesDati", 6000, CampoTipo::VARCHAR),
  new Campo("finito", 1, CampoTipo::BOOLEAN, NULL, "0")
);
