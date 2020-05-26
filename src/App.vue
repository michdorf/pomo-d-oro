<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/statistica">Statistica</router-link> |
      <router-link to="/errori">Debug</router-link>
      <!-- <router-link to="/about">About</router-link> -->
    </div>
    <router-view />
  </div>
</template>

<script>
import "./js/filters.js";
import { default as pomoStore } from "@/js/pomo-store.js";

export default {
  name: "App",
  store: pomoStore,
  data() {
    return {
      modifNonSalvate: false,
      blurred: false
    };
  },
  methods: {
    chiediServer() {
      if (this.modifNonSalvate) {
        return;
      }
      this.richiedi("chiedi");
    }
  },
  created() {
    let blurT;
    window.addEventListener("blur", () => {
      blurT = Date.now();
      this.blurred = true;
    });
    window.addEventListener("focus", () => {
      this.blurred = false;
      if (blurT - Date.now() > 30 * 60 * 1000) {
        this.chiediServer();
      }
    });
  }
};
</script>

<style>
@import "./css/main.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
