<template>
  <canvas :width="pCanvasSize" :height="pCanvasSize">
    No support for canvas
  </canvas>
</template>

<script>
/**
 * Quadrante (watchface)
 */
export default {
  props: ["perc", "canvasSize"],
  watch: {
    perc() {
      requestAnimationFrame(this.disegna);
    }
  },
  data() {
    return {
      ctx: undefined,
      pCanvasSize: 400,
      bgColor: "gray",
      frontaleColore: "blue"
    };
  },
  methods: {
    configurazione() {
      if (this.canvasSize) {
        this.pCanvasSize = this.canvasSize;
      }
      const canvas = this.$el; /*.querySelector("canvas")*/
      this.ctx = canvas.getContext("2d");
      this.ctx.strokeStyle = "gray";
      // this.ctx.fillStyle = "red";
      this.ctx.lineWidth = 2;
    },
    disegna() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.pCanvasSize, this.pCanvasSize);
      const radius = this.pCanvasSize / 2;
      const nGradi = 60;
      ctx.save();

      /* ctx.arc(radius, radius, 4, 0, 2 * Math.PI);
      ctx.fill(); */

      ctx.translate(radius, radius); // translate to rotating pivot
      ctx.rotate(Math.PI); // Start ved kl. 12

      let len = 10;
      for (let i = 0; i < nGradi; i++) {
        ctx.beginPath(); // Vigtig ift. at ændre baggrundsfarve
        if ((i / nGradi) * 100 > 100 - this.perc) {
          ctx.strokeStyle = this.bgColor;
        } else {
          ctx.strokeStyle = this.frontaleColore;
        }
        len = i % 5 === 0 ? 20 : 10;
        ctx.moveTo(0, radius);
        ctx.lineTo(0, radius - len);
        ctx.stroke();
        ctx.rotate(Math.PI * (2 / nGradi));
      }

      ctx.restore();
    }
  },
  mounted() {
    this.configurazione();
    requestAnimationFrame(this.disegna);
  }
};
</script>
