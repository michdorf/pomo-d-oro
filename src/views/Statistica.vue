<template>
  <ListaSessioni :sessioni="$store.getters.sessioni"></ListaSessioni>
</template>

<script>
import ListaSessioni from "../components/lista-sessioni.vue";

export default {
  name: "StatisticaView",
  components: {
    ListaSessioni
  }
};
</script>
