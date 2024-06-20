declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: (typeof import('vue-router'))['RouterLink'];
    RouterView: (typeof import('vue-router'))['RouterView'];
    TransitionGroup: (typeof import('vue'))['TransitionGroup'];
    Transition: (typeof import('vue'))['Transition'];
    KeepAlive: (typeof import('vue'))['KeepAlive'];
  }
}

export {};
