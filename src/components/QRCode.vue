<template>
  <div>
    <canvas
      :style="{ height: size + 'px', width: size + 'px' }"
      :height="size"
      :width="size"
      ref="qr"
    >
    </canvas>
  </div>
</template>

<script>
import qr from "qr.js";

export default {
  props: {
    val: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 100
    },
    // 'L', 'M', 'Q', 'H'
    level: String,
    bgColor: {
      type: String,
      default: "#FFFFFF"
    },
    fgColor: {
      type: String,
      default: "#000000"
    },
    image: {
      type: String
    },
    imageSize: {
      type: Number,
      default: 20
    }
  },
  watch: {
    size: function() {
      this.update();
    },
    val: function() {
      this.update();
    },
    level: function() {
      this.update();
    },
    bgColor: function() {
      this.update();
    },
    fgColor: function() {
      this.update();
    },
    image: function() {
      this.update();
    },
    imageSize: function() {
      this.update();
    }
  },
  mounted() {
    this.update();
  },
  methods: {
    update() {
      var size = this.size;
      var bgColor = this.bgColor;
      var fgColor = this.fgColor;
      var $qr = this.$refs.qr;

      var qrcode = qr(this.val);

      var ctx = $qr.getContext("2d");
      var cells = qrcode.modules;
      var tileW = size / cells.length;
      var tileH = size / cells.length;
      var scale =
        (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);

      $qr.height = $qr.width = size * scale;
      ctx.scale(scale, scale);

      cells.forEach(function(row, rdx) {
        row.forEach(function(cell, cdx) {
          ctx.fillStyle = cell ? fgColor : bgColor;
          var w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
          var h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
          ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
        });
      });
      if (this.image) {
        let image = new Image();
        image.src = this.image;
        image.onload = () => {
          ctx.drawImage(
            image,
            (this.size - this.imageSize) / 2,
            (this.size - this.imageSize) / 2,
            this.imageSize,
            this.imageSize
          );
        };
      }
    }
  }
};

function getBackingStorePixelRatio(ctx) {
  return (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1
  );
}
</script>
