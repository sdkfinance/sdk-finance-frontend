<template>
  <el-image
    :style="`max-width: ${maxWidth}px; max-height: ${maxHeight}px`"
    :src="imageUrl"
    :preview-src-list="[imageUrl]"/>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppImage extends Vue {

  @Prop({ default: '', type: String }) readonly imageUrl!: string;

  @Prop({ default: '410', type: String }) readonly maxWidth!: string;

  @Prop({ default: '312', type: String }) readonly maxHeight!: string;

}
</script>
