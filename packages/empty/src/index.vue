<template>
  <div class="el-empty">
    <div class="el-empty__image" :style="imageStyle">
      <!-- 禁止鼠标拖动图片 ondragstart="return false" -->
      <!-- 禁止树鼠标右键保存图片 oncontextmenu="return false" -->
      <img v-if="image" :src="image" ondragstart="return false" />
      <slot v-else name="image">
        <img-empty />
      </slot>
    </div>
    <div class="el-empty__description">
      <slot v-if="$slots.description" name="description"></slot>
      <p v-else>{{ emptyDescription }}</p>
    </div>
    <div v-if="$slots.default" class="el-empty__bottom">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import ImgEmpty from "./img-empty.vue";
import { t } from "element-ui/src/locale";

// 禁止鼠标拖动图片 ondragstart="return false"
// 禁止树鼠标右键保存图片 oncontextmenu="return false"
// img v-if="image" :src="image" ondragstart="return false" />

export default {
  name: "ElEmpty",
  components: {
    [ImgEmpty.name]: ImgEmpty, // 默认图片组件
  },
  props: {
    image: {
      // 图片地址在
      type: String,
      default: "",
    },
    imageSize: Number,
    description: {
      // 文本描述
      type: String,
      default: "",
    },
  },
  computed: {
    emptyDescription() {
      return this.description || t("el.empty.description"); // 多语言
    },
    imageStyle() {
      return {
        width: this.imageSize ? `${this.imageSize}px` : "",
      };
    },
  },
};
</script>
