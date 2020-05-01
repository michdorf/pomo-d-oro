<template>
  <canvas :width="canvas_size" :height="canvas_size"></canvas>
</template>

<script>
export default {
  name: "Arco",
  props: ["perc", "color", "size"],
  data() {
    return {
      ctx: 0,
      psize: 48,
      pcolor: "#28f"
    };
  },
  computed: {
    canvas_size() {
      return this.psize + 4;
    }
  },
  watch: {
    perc() {
      requestAnimationFrame(this.loop);
    }
  },
  methods: {
    drawBorder(ctx, x, y, radius) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    },
    drawPie(ctx, x, y, radius, percent) {
      ctx.translate(x, y); // translate to rotating pivot
      ctx.rotate(Math.PI * 1.5); // rotate, here 90° deg
      ctx.translate(-x, -y); // translate back

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, 0, (2 * Math.PI * percent) / 100);
      ctx.fill(); // ctx.stroke();

      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    },
    loop() {
      // .querySelector("canvas")
      this.ctx = this.$el /*.querySelector("canvas")*/
        .getContext("2d");

      this.ctx.strokeStyle = this.pcolor;
      this.ctx.fillStyle = this.pcolor;
      this.ctx.lineWidth = Math.ceil(this.psize / 16);
      const border_radius = this.psize / 2;
      const radius = border_radius - 4;

      this.ctx.clearRect(0, 0, this.canvas_size, this.canvas_size);
      this.drawBorder(
        this.ctx,
        border_radius + 2,
        border_radius + 2,
        border_radius
      );
      this.drawPie(this.ctx, radius + 6, radius + 6, radius, this.perc);
      // requestAnimationFrame(this.loop);
    }
  },
  mounted() {
    this.psize = this.size || 48;
    this.pcolor = this.color || "#28f";
    requestAnimationFrame(this.loop);
  }
};
</script>
