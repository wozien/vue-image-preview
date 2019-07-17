<template>
  <div class="image-preview-bg" ref="bg" @mousemove.stop="handleMousemove" v-show="isShow" @click="handleBgClick($event)">
    <div class="image-wrapper">
      <div class="image" :style="imgStyle" @mousedown.prevent="handleMousedown" @mouseup="handleMouseup" ref="img">
        <img :src="images[index]" :class="rotateCls" />
        <div class="close" @click.stop="hide" @mousedown.stop>
          <i class="iconfont icon-close"></i>
        </div>
      </div>
    </div>

    <div class="btn-wrapper" v-show="!moving">
      <i class="iconfont icon-left" :class="{ disable: index === 0 }" @click="prev"></i>
      <i class="iconfont icon-rotate" @click="rotateImg"></i>
      <i class="iconfont icon-download" @click="download" v-if="canDownload"></i>
      <i class="iconfont icon-smaller" @click="handleScale(-1)" v-if="!canWheel"></i>
      <i class="iconfont icon-bigger" @click="handleScale(1)" v-if="!canWheel"></i>
      <i class="iconfont icon-right" :class="{ disable: index === images.length - 1 }" @click="next"></i>
    </div>

    <a download class="download" :href="images[index]" target="_blank" ref="download" v-show="canDownload"></a>
  </div>
</template>

<script>
export default {
  name: 'VImagePreview',

  props: {
    // 图片数据
    images: {
      type: Array,
      default: () => []
    },
    // 图片显示的索引
    startIndex: {
      type: Number,
      default: 0
    },
    // 是否显示下载，只支持同源
    canDownload: {
      type: Boolean,
      default: false
    },
    // 是否支持滑轮缩放
    canWheel: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      // 图片的宽高
      width: 50,
      height: 50,
      // 图片的定位
      top: 0,
      left: 0,
      moving: false,
      isShow: false,
      index: 0,
      rotate: 0
    };
  },

  computed: {
    imgStyle() {
      return {
        width: Math.round(this.width) + 'px',
        height: Math.round(this.height) + 'px',
        top: Math.round(this.top) + 'px',
        left: Math.round(this.left) + 'px'
      };
    },
    rotateCls() {
      return this.rotate ? `rotate${this.rotate}` : '';
    }
  },

  mounted() {
    this.getCalLength();

    // 窗口缩放事件
    window.addEventListener(
      'resize',
      this._throttle(() => {
        this.getCalLength();
        this.layout();
      }, 200)
    );
  },

  methods: {
    prev() {
      if (this.index) {
        this.index--;
        this.rotate = 0;
        this.layout();
      }
    },
    next() {
      if (this.index < this.images.length - 1) {
        this.index++;
        this.rotate = 0;
        this.layout();
      }
    },
    rotateImg() {
      this.rotate = (this.rotate + 1) % 4;
    },
    download() {
      this.$refs.download.click();
    },
    handleScale(der) {
      if ((this.width <= 50 || this.height <= 50) && der < 0) return;
      const bs = this.width / this.height;
      const pox = this.left + this.width / 2;
      const poy = this.top + this.height / 2;
      if (der > 0) {
        this.height += 50;
      } else {
        this.height -= 50;
      }
      this.width = bs * this.height;
      this.left = pox - this.width / 2;
      this.top = poy - this.height / 2;
    },
    show() {
      this.index = this.startIndex;
      this.isShow = true;
      if (this.canWheel) {
        this.addWheel();
      }
    },
    hide() {
      this.isShow = false;
      this.rotate = 0;
      this.removeWheel();
    },

    loadImage(src, index) {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        this.orgHeight[index] = image.height;
        this.orgWidth[index] = image.width;
        if (index === this.index) {
          // 加载到首加载图片
          this.layout();
        }
      };
    },

    getCalLength() {
      this.clientHeight = window.innerHeight;
      this.clientWidth = window.innerWidth;
      // 200 为按钮的预留高度
      this.calHeight = (this.clientHeight - 100) * 0.8;
      this.calWidth = this.clientWidth * 0.8;
    },

    getOrgLength() {
      this.orgWidth = [];
      this.orgHeight = [];
      this.images.forEach((src, i) => {
        this.loadImage(src, i);
      });
    },

    layout() {
      const orgWidth = this.orgWidth[this.index];
      const orgHeight = this.orgHeight[this.index];

      if (!orgWidth || !orgHeight) {
        return;
      }

      const bs = orgWidth / orgHeight;
      const bsW = orgWidth / this.calWidth;
      const bsH = orgHeight / this.calHeight;

      // 计算图片宽高
      // 小于计算范围的直接显示原图，否则根据宽高比判断是否是长图
      // 如果是长度，直接缩小5倍
      // 不是则按计算范围铺满
      if (orgHeight <= this.calHeight && orgWidth <= this.calWidth) {
        this.height = orgHeight;
      } else if ((bs < 0.25 && bsH > 3) || (bs > 4 && bsW > 2)) {
        this.height = orgHeight / 5;
      } else {
        if (orgWidth > this.calWidth) {
          this.height = this.calWidth / bs;
        }
        if (this.height >= this.calHeight || orgHeight >= this.calHeight) {
          this.height = this.calHeight;
        }
      }

      this.width = bs * this.height;
      // 计算图片位置
      this.left = (this.clientWidth - this.width) / 2;
      this.top = (this.clientHeight - 100 - this.height) / 2;
    },
    handleMousedown(e) {
      if (this.movestart || this.moving) return;
      this.movestart = true;
      this.sx = e.pageX;
      this.sy = e.pageY;
    },
    handleMousemove(e) {
      if (!this.movestart) return;
      this.moving = true;
      let delX = e.pageX - this.sx;
      let delY = e.pageY - this.sy;
      this.left += delX;
      this.top += delY;
      this.sx = e.pageX;
      this.sy = e.pageY;
    },
    handleMouseup() {
      this.movestart = false;
      this.moving = false;
    },
    handleBgClick(e) {
      const target = e.target;
      if (target === this.$refs.bg) {
        this.hide();
      }
    },
    // 处理滑轮的放大缩小
    handleMousewheel(e) {
      const delta = e.deltaY || e.wheelDelta || -e.detail;
      const img = this.$refs.img;
      let width = Math.floor(this.width);
      let height = Math.floor(this.height);
      const bs = width / height;

      // 计算缩放点的占比
      let offsetX = e.offsetX || e.pageX - img.style.left;
      let offsetY = e.offsetY || e.pageY - img.style.top;
      let bsX = offsetX / width;
      let bsY = offsetY / height;

      if (delta > 0) {
        height += 50;
      } else {
        height -= 50;
        if (height < 50) {
          height = 50;
        }
      }

      this.height = height;
      this.width = bs * this.height;
      this.left = e.pageX - this.width * bsX;
      this.top = e.pageY - this.height * bsY;
    },
    addWheel() {
      this.wheelHandle = this._throttle(this.handleMousewheel, 40);
      this.$refs.img.addEventListener('mousewheel', this.wheelHandle);
      this.$refs.img.addEventListener('DOMMouseScroll', this.wheelHandle);
    },
    removeWheel() {
      if (this.wheelHandle) {
        this.$refs.img.removeEventListener('mousewheel', this.wheelHandle);
        this.$refs.img.removeEventListener('DOMMouseScroll', this.wheelHandle);
      }
    },
    // 函数防抖
    _debounce(fn, delay) {
      let timer;
      return function(...arg) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn.apply(this, arg);
        }, delay);
      };
    },

    // 函数节流
    _throttle(fn, delay) {
      let pre = Date.now();
      return function(...arg) {
        let now = Date.now();
        if (now - pre >= delay) {
          fn.apply(this, arg);
          pre = now;
        }
      };
    }
  },

  watch: {
    images() {
      this.getOrgLength();
    },
    canWheel(val, oldVal) {
      if (val == oldVal) return;
      if (val) {
        this.addWheel();
      } else {
        this.removeWheel();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../asset/iconfont.css';

.image-preview-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  .image-wrapper {
    position: relative;
    .image {
      position: absolute;
      min-width: 50px;
      min-height: 50px;
      cursor: move;
      > img {
        width: 100%;
        height: 100%;
        &.rotate1 {
          transform: rotate(90deg);
        }
        &.rotate2 {
          transform: rotate(180deg);
        }
        &.rotate3 {
          transform: rotate(270deg);
        }
      }
      .close {
        position: absolute;
        top: -20px;
        right: -20px;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.6);
        cursor: pointer;
        > i {
          font-size: 30px;
          color: #fff;
        }
      }
    }
  }

  .btn-wrapper {
    position: fixed;
    bottom: 50px;
    left: 50%;
    width: 550px;
    height: 50px;
    margin-left: -275px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 45px;
    > i {
      color: #fff;
      font-size: 30px;
      &.disable {
        color: #6e6e6e;
      }
    }
  }

  .download {
    opacity: 0;
  }
}
</style>
