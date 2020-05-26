<template>
  <span v-if="notiDisponibile">
      <button v-if="!permesso" @click="chiediPermesso()">Giv tilladelse til notificationer</button>
    </span>
</template>

<script>
import Notizie from '../js/notificazioni.js';

export default {
  data() {
    return {
      n: new Notizie(),
      permesso: false,
      notiDisponibile: ('Notification' in window) /* ('requestPermission' in Notification) */
    }
  },
  methods: {
    chiediPermesso() {
      this.n.chiediPermesso();
      this.permesso = (Notification.permission === "granted");
    }
  },
  created() {
    this.n.suPermesso(() => {
      this.permesso = (Notification.permission === "granted");
    });
    this.n.verifica();
    this.permesso = (Notification.permission === "granted");
  }
}
</script>
