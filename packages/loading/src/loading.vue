<template>
  <transition name="el-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="el-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">

      <div class="el-loading-spinner">
        <!-- svg图片 -->
        <svg v-if="!spinner" class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <i v-else :class="spinner"></i>

        <!-- 可以加文字 -->
        <p v-if="text" class="el-loading-text">{{ text }}</p>
      </div>

    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        text: null, // 显示在加载图标下方的加载文案
        spinner: null, // 自定义加载图标类名
        background: null,
        fullscreen: true,
        visible: false,
        customClass: '' // 	Loading 的自定义类名
      };
    },

    methods: {
      handleAfterLeave() {
        this.$emit('after-leave');
      },
      setText(text) {
        this.text = text;
      }
    }
  };
</script>
