import type { InjectionKey } from 'vue';

import type { IPlainObject } from '../types';

export const serverFormErrors: InjectionKey<IPlainObject> = Symbol('Use in app-form for provide/inject server errors');
