import Vue, { Component } from 'vue';

import { RenderableToastContent, ToastComponent, ToastContent, VueClass } from '../types';

function hasProp<O extends unknown, K extends PropertyKey>(obj: O, propKey: K): obj is O & { [key in K]: unknown } {
  return Object.prototype.hasOwnProperty.call(obj, propKey);
}

function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isJSX(obj: unknown): obj is JSX.Element {
  return hasProp(obj, 'tag') && isNonEmptyString(obj.tag);
}

function isTouchEvent(event: Event): event is TouchEvent {
  return window.TouchEvent && event instanceof TouchEvent;
}

function hasRenderFunction<O extends unknown>(obj: O): obj is O & { render: Function } {
  return hasProp(obj, 'render') && isFunction(obj.render);
}

function isConstructor(c: unknown): c is VueClass<Vue> {
  return isFunction(c) && hasProp(c, 'cid');
}

function isVueComponent(c: unknown): c is Component {
  if (isConstructor(c)) {
    return true;
  }

  if (!isObject(c)) {
    return false;
  }

  if (c.extends || c.Ctor) {
    return true;
  }

  if (isString(c.template)) {
    return true;
  }

  return hasRenderFunction(c);
}

function isVueInstanceOrComponent<O extends unknown>(obj: O): obj is O & Component {
  return obj instanceof Vue || isVueComponent(obj);
}

function isToastComponent(obj: unknown): obj is ToastComponent {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return hasProp(obj, 'component') && isToastContent(obj.component);
}

function isToastContent(obj: unknown): obj is ToastContent {
  return !isUndefined(obj) && (isString(obj) || isVueInstanceOrComponent(obj) || hasRenderFunction(obj) || isJSX(obj) || isToastComponent(obj));
}

function isDOMRect(obj: unknown): obj is DOMRect {
  return (
    isObject(obj) &&
    isNumber(obj.height) &&
    isNumber(obj.width) &&
    isNumber(obj.right) &&
    isNumber(obj.left) &&
    isNumber(obj.top) &&
    isNumber(obj.bottom)
  );
}

function getX(event: MouseEvent | TouchEvent) {
  return isTouchEvent(event) ? event.targetTouches[0].clientX : event.clientX;
}

function getY(event: MouseEvent | TouchEvent) {
  return isTouchEvent(event) ? event.targetTouches[0].clientY : event.clientY;
}

function getVueComponentFromObj(obj: ToastContent): RenderableToastContent {
  if (isToastComponent(obj)) {
    // Recurse if component prop
    return getVueComponentFromObj(obj.component);
  }

  if (isJSX(obj)) {
    // Create render function for JSX
    return {
      render() {
        return obj;
      },
    };
  }

  // Return the actual object if regular vue component
  return obj;
}

function removeElement(el: Element) {
  if (!isUndefined(el.remove)) {
    el.remove();
  } else if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

/**
 * ID generator
 */
const getId = ((i) => () => {
  // eslint-disable-next-line no-param-reassign
  i += 1;
  return i;
})(0);

export {
  hasProp,
  isFunction,
  isString,
  isNonEmptyString,
  isNumber,
  isUndefined,
  isObject,
  isJSX,
  isTouchEvent,
  isToastComponent,
  isConstructor,
  isDOMRect,
  getX,
  getY,
  hasRenderFunction,
  isVueComponent,
  isVueInstanceOrComponent,
  getVueComponentFromObj,
  removeElement,
  getId,
};
