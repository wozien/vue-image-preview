<template>
  <div id="#app">
    <v-image-preview ref="preview" :images="images" :start-index="index" :can-wheel="canWheel" :can-download="true"></v-image-preview>
    <button @click="show">click不可鼠标滑动</button>
    <button @click="show2">click可以鼠标滑动</button>
  </div>
</template>

<script>
import VImagePreview from '../src/index';

export default {
  name: 'app',

  data() {
    return {
      images: [],
      index: 0,
      canWheel: false
    };
  },

  methods: {
    show() {
      this.images = ['http://blog.inoob.xyz/posts/21750/4.png', 'http://blog.inoob.xyz/posts/a2938be2/01.png', 'http://blog.inoob.xyz/posts/19736/4.png'];
      this.index = 0;
      this.canWheel = false;
      this.$refs.preview.show();
    },
    show2() {
      this.images = [
        'http://blog.inoob.xyz/82e95b31fec2fa9969d17e65bdaf4304.jpg',
        'http://blog.inoob.xyz/70cb616f9adf09f8b2346550b8be34e1.jpg',
        'http://blog.inoob.xyz/7ad117f079bb2b920ea568cc94594a4a.jpg',
        'http://blog.inoob.xyz/1010927808.jpg'
      ];
      this.index = 0;
      this.canWheel = true;
      this.$refs.preview.show();
    }
  },

  components: {
    VImagePreview
  }
};
</script>
