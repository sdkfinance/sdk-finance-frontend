export const DATE_PICKER_DRAG_ATTRIBUTE = {
  highlight: {
    start: {
      class: 'app-date-picker--highlight-drag-start',
      contentClass: 'app-date-picker--highlight-drag-content-start',
    },
    base: {
      class: 'app-date-picker--highlight-drag-base',
      contentClass: 'app-date-picker--highlight-drag-content-base',
    },
    end: {
      class: 'app-date-picker--highlight-drag-end',
      contentClass: 'app-date-picker--highlight-drag-content-end',
    },
  },
};

export const DATE_PICKER_SELECT_ATTRIBUTE = {
  highlight: {
    start: {
      class: 'app-date-picker--highlight-selected-start',
      contentClass: 'app-date-picker--highlight-content-selected-start',
    },
    base: {
      class: 'app-date-picker--highlight-selected-base',
      contentClass: 'app-date-picker--highlight-content-selected-base',
    },
    end: {
      class: 'app-date-picker--highlight-selected-end',
      contentClass: 'app-date-picker--highlight-content-selected-end',
    },
  },
};

export const DATEPICKER_ATTRIBUTES = [
  {
    key: 'today',
    highlight: {
      class: 'app-date-picker--highlight-today',
      contentClass: 'app-date-picker--highlight-content-today',
      style: '',
      contentStyle: '',
    },
    dates: new Date(),
  },
];
