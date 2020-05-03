/**
 * I første omgang tænkt som et event-system til asynkrone applikationer
 */
import Component from '@/interface/VueComponent';

export default class Osservabile {
  ascoltatori:Function[] = [];
  
  /**
   * Subscribe all'osservabile. Ricordati di eseguire zitto
   * @param funz - Funzione che viene eseguito ogni volta che cambi valore
   */
  senti(funz: Function, componentAutoZitto?: Component):number {
    const sentiInx = this.ascoltatori.push(funz) - 1; // .push() returns array-length
    if (componentAutoZitto) {
      this.autoZitto(sentiInx, componentAutoZitto);
    }
    return sentiInx;
  };

  autoZitto(sentiInx:number, component: Component) {
    if (!component.$on) { return false }
    component.$on("hook:beforeDestroy", () => this.zitto(sentiInx));
  }

  zitto(sentiInx:number) {
    this.ascoltatori[sentiInx] = () => {
      /* Rimuove funzionalita */
    };
  }

  prossimo(val:any) {
    for (let i = 0; i < this.ascoltatori.length; i++) {
      this.ascoltatori[i](val);
    }
  };
}

export class Riproducibile extends Osservabile {
  passaggi:Array<any> = [];
  sentiInx:number;
  
  constructor() {
    super();
    this.sentiInx = this.senti((val:any) => {
      this.passaggi.push(val);
    });
  }

  riproduci() {
    const sentiInx = this.sentiInx;
    this.passaggi.forEach(passaggio => {
      this.ascoltatori.forEach((ascoltatore, i) => {
        if (i === sentiInx) { return; }
        ascoltatore(passaggio);
      });
    });
  };
}
