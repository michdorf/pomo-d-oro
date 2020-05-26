import Vue from "vue";
import date from "../webApp/js/date.js";

Vue.filter("data", function(value) {
  return date.datastr(value, false, "data");
});

Vue.filter("ora", function(value) {
  return date.datastr(value, false, "ora");
});

Vue.filter("giornodata", function(value) {
  return date.datastr(value, false, "giornodata");
});
