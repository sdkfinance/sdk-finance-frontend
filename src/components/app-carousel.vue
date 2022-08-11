<template>
  <div
    ref="swiper"
    class="swiper swiper-container">
    <div class="swiper-wrapper">
      <div
        v-for="(slideData, index) in slides"
        :key="`swiper_slide_${index}_${slideData[keyProp]}`"
        class="swiper-slide">
        <slot v-bind="{ slideData, index }"/>
      </div>
    </div>
    <div
      v-show="isPrevVisible"
      class="app-carousel__button app-carousel__button-prev"
      @click="prevSlide">
      <i class="icon-arrow-left"/>
    </div>
    <div
      v-show="isNextVisible"
      class="app-carousel__button app-carousel__button-next"
      @click="nextSlide">
      <i class="icon-arrow-right"/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Ref, Watch, Vue,
} from 'vue-property-decorator';
import Swiper, { SwiperOptions } from 'swiper';
import 'swiper/swiper-bundle.css';

@Component
export default class AppCarousel extends Vue {

  @Ref('swiper') readonly swiperRef!: any;

  @Prop({ type: Array, default: () => ([]) }) readonly slides!: [];

  @Prop({ type: String, default: 'id' }) readonly keyProp!: string;

  readonly swiperOption: SwiperOptions = {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 20,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    centeredSlidesBounds: true,
    allowTouchMove: false,
  };

  protected swiper: any = {};

  protected get isPrevVisible(): boolean {
    return !this.swiper.isBeginning && !this.isAllSlidersVisible;
  }

  protected get isNextVisible(): boolean {
    return !this.swiper.isEnd && !this.isAllSlidersVisible;
  }

  protected get isAllSlidersVisible(): boolean {
    const { size, slidesSizesGrid } = this.swiper || {};
    const spaceBetween = this.swiperOption.spaceBetween || 0;
    const slidersWidth = slidesSizesGrid?.reduce((sum: number, width: number) => sum + width + spaceBetween, 0);
    return slidersWidth <= size;
  }

  @Watch('slides')
  async updateState() {
    await this.$nextTick();
    this.swiper.updateSize();
    this.swiper.updateSlides();
    this.swiper.updateProgress();
    this.swiper.updateSlidesClasses();
  }

  @Watch('swiper.visibleSlidesIndexes')
  handlerOpacity(value: number[]) {
    if (!value?.length) return;
    const { slides, isBeginning, isEnd } = this.swiper;
    const [firstVisibleSlide] = value;
    const lastVisibleSlide = value[value.length - 1];
    const lastSlideIndex = slides.length - 1;

    slides.forEach((node: HTMLElement, i: number) => {
      node.classList.remove('opacity-first', 'opacity-last');
      if (this.isAllSlidersVisible) return;
      if (!(i === 0 && isBeginning) && !(i === lastSlideIndex && isEnd)) {
        if (firstVisibleSlide === i) node.classList.add('opacity-first');
        if (lastVisibleSlide === i) node.classList.add('opacity-last');
      }
    });
  }

  public nextSlide(): void {
    this.swiper.slideNext();
  }

  public prevSlide(): void {
    this.swiper.slidePrev();
  }

  mounted() {
    this.swiper = new Swiper(this.swiperRef, this.swiperOption);
  }

  beforeDestroy() {
    this.swiper.destroy();
  }

}
</script>

<style lang="scss">
@mixin opacity-slide($bcg) {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: $bcg;
}

.swiper-slide {
  width: auto;

  &.opacity-first::before {
    @include opacity-slide(linear-gradient(260deg, rgba(255, 255, 255, 0.5) 0, #FFFFFF 60%));
  }

  &.opacity-last::before {
    @include opacity-slide(linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0, #FFFFFF 60%));
  }
}

.app-carousel__button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  z-index: 10;
  transform: translateY(-50%);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: $primary-color;
  font-size: 12px;
  cursor: pointer;

  &-next {
    right: 11px;
  }

  &-prev {
    left: 11px;
  }
}
</style>
