<template>
  <div>
      <div style="height: 3px; display: inline-block; background-color: silver; border-style: solid; border-width: 0; margin-right: 2px" :style="{'width': (width - (perc/100*width) + 'px'), 'border-color': color, 'border-left-width': (perc/100*width) + 'px'}" v-for="perc in linee"></div>
    </div>
</template>

<script>
export default {
  props: ["linee", "pwidth", "pcolor"],
  data() {
    return {
      width: this.pwidth || 100,
      color: this.pcolor || "#28f"
    }
  }
}
</script>