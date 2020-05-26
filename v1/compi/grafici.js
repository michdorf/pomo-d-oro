/*
 1. Sessioner pr. dag
 2. Sessioner på timetal af dagen
 3. Sessioner pr. projekt
 4. Sesseioner pr. ugedag

 Eventuelt del det hele op i måneder eller uger og skriv om der alt i alt er fremgang eller tilbagegang (grøn og rød pil)
 Eventuelt lad bruger vælge at angive i minutter/timer vs. sessioner
*/

Vue.component("app-grafici", {
  props: ["sessioni"],
  template: `
    <div>
      <app-diagramma-lineare :sessioni="sessioni"></app-diagramma-lineare>
      <app-diagramma-orette :sessioni="sessioni"></app-diagramma-orette>
    </div>
  `
})
