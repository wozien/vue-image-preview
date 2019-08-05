基于 vue.js 实现的网页图片预览组件，支持拖拽，滚动缩放

## 开始使用

### 下载

```bash
npm install @wozien/vue-image-preview
```

### 引入组件

```html
<template>
  <div id="#app">
    <v-image-preview
      ref="preview"
      :is-show.sync="isShow"
      :images="images"
      :start-index="index"
      :can-wheel="canWheel"
    ></v-image-preview>
  </div>
</template>

<script>
  import VImagePreview from '@wozien/vue-image-preview';

  export default {
    name: 'app',

    data() {
      return {
        isShow: false,
        images: ['.../a.jpg', '.../b.jpg'],
        index: 0,
        canWheel: false
      };
    },

    methods: {
      show() {
        // this.$refs.preview.show();
        this.isShow = true;
      }
    }
  };
</script>
```

## 说明

### 属性

<dl>
  <dt>isShow: Boolean</dt>
  <dd>是否显示图片预览</dd>

  <dt>images: Array&lt;string&gt; </dt>
  <dd>图片url数组</dd>

  <dt>start-index: Number</dt>
  <dd>开始预览的图片索引，默认为0</dd>

  <dt>can-download: Boolean</dt>
  <dd>是否可下载，默认为 false； 注意： 下载图片目前只使用同源情况，否则为新窗口打开原图</dd>

  <dt>can-wheel: Boolean</dt>
  <dd>是否支持鼠标滑轮缩放，默认为true</dd>
</dl>

### 方法

<dl>
  <dt>show</dt>
  <dd>显示图片预览界面</dd>

  <dt>hide</dt>
  <dd>隐藏图片预览界面</dd>

  <dt>next</dt>
  <dd>跳转下一张</dd>

  <dt>prev</dt>
  <dd>跳转上一张</dd> 
</dl>
