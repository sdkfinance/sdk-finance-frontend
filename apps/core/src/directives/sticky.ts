import type { VNode, VNodeDirective } from 'vue';

const observer = (stickyEl: HTMLElement): IntersectionObserver =>
  new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        stickyEl.classList.remove('is-sticky');
      } else {
        stickyEl.classList.add('is-sticky');
      }
    },
    { root: null, threshold: 0.1 },
  );

export const onSticky = () => ({
  bind(el: HTMLElement, binding: VNodeDirective, vNode: VNode): void {
    setTimeout(() => {
      // eslint-disable-next-line no-unused-expressions
      vNode?.context?.$nextTick(() => {
        const parentEl = el.parentNode || el.parentElement;
        const targetEl = document.createElement('div');
        // eslint-disable-next-line no-unused-expressions
        parentEl?.insertBefore(targetEl, el);
        // @ts-ignore
        // eslint-disable-next-line no-underscore-dangle
        el.__sticky__observer__ = observer(el);
        // @ts-ignore
        // eslint-disable-next-line no-underscore-dangle
        el.__sticky__observer__.observe(targetEl);
      });
    }, 0);
  },
  unbind(el: HTMLElement): void {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    el.__sticky__observer__.disconnect();
  },
});
