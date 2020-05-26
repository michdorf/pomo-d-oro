/**
* Quadrante (watchface)
*/
Vue.component('app-quadrante', {
  props: ['perc', 'canvas_size'],
  watch: {
    perc() {
      requestAnimationFrame(this.disegna);
    }
  },
  data() {
    return {
      ctx: undefined,
      pcanvas_size: 400,
      bg_color: "gray",
      frontale_colore: "blue",
    }
  },
  methods: {
    configurazione() {
      if (this.canvas_size) {
        this.pcanvas_size = this.canvas_size;
      }
      let canvas = this.$el/*.querySelector("canvas")*/;
      this.ctx = canvas.getContext('2d');
      this.ctx.strokeStyle = "gray";
      // this.ctx.fillStyle = "red";
      this.ctx.lineWidth = 2;
    },
    disegna() {
      let ctx = this.ctx;
      ctx.clearRect(0, 0, this.pcanvas_size, this.pcanvas_size);
      let radius = this.pcanvas_size / 2;
      let n_gradi = 60;
      ctx.save();

      /* ctx.arc(radius, radius, 4, 0, 2 * Math.PI);
      ctx.fill(); */

      ctx.translate(radius, radius); // translate to rotating pivot
      ctx.rotate(Math.PI); // Start ved kl. 12

      let len = 10;
      for (let i = 0; i < n_gradi; i++) {
        ctx.beginPath(); // Vigtig ift. at ændre baggrundsfarve
        if ((i / n_gradi * 100) > (100 - this.perc)) {
          ctx.strokeStyle = this.bg_color;
        } else {
          ctx.strokeStyle = this.frontale_colore;
        }
        len = (i % 5 === 0) ? 20 : 10;
        ctx.moveTo(0, radius);
        ctx.lineTo(0, radius - len);
        ctx.stroke();
        ctx.rotate(Math.PI * (2 / n_gradi));
      }

      ctx.restore();
    }
  },
  mounted() {
    this.configurazione();
    requestAnimationFrame(this.disegna);
  },
  template: `
    <canvas :width="pcanvas_size" :height="pcanvas_size">
      No support for canvas
    </canvas>
  `
})
