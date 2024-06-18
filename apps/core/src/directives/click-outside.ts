import type { VNode, VNodeDirective } from 'vue';

export const clickOutside = () => ({
  bind(el: HTMLElement, binding: VNodeDirective, vNode: VNode) {
    // @ts-ignore
    // eslint-disable-next-line
    el.__click_out_side_fn__ = (event: any) => {
      if (!(el === event.target || el.contains(event.target))) {
        // @ts-ignore
        binding.value(event);
        event.stopPropagation();
      }
    };
    // @ts-ignore
    // eslint-disable-next-line
    document.body.addEventListener('click', el.__click_out_side_fn__);
  },
  unbind(el: HTMLElement) {
    // @ts-ignore
    // eslint-disable-next-line
    document.body.removeEventListener('click', el.__click_out_side_fn__);
  },
});
