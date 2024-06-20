# SDK.finance core client

---

## Project main libraries and services documentation

#### Core

- [Vue](https://vuejs.org/)
- [Vuex](https://vuex.vuejs.org/)
- [Vue router](https://router.vuejs.org/)
- [Vue i18n](https://kazupon.github.io/vue-i18n/introduction.html)
- [HTTP client Axios](https://github.com/axios/axios)

#### Typing

- [Typescript](https://www.typescriptlang.org/)
- [Vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)
- [Vuex-module-decorators](https://github.com/championswimmer/vuex-module-decorators)

#### Ui framework

- [Element UI](https://element.eleme.io/#/en-US/component/installation)

#### Documentation code and components

- [Storybook](https://storybook.js.org/docs/react/get-started/introduction)

#### Generate icons

- [Icomoon.io](https://icomoon.io/#docs)

---

## Setup for development

Setup development environment on a local machine

1. Install [Node.js](https://nodejs.org/) = `v20.10.0`
2. Install NPM = `10.2`
3. Import this project
4. Checkout to `develop` branch.
5. Install dependencies `npm install`
6. Set up domain backend-develop instance in `.env.development` => `BACKEND_HOST`.

### Run develop server and compiles with hot-reloads

```
npm run dev
```

### Run lints and fixes files

```
npm run lint
```

```

### Run storybook

```

npm run storybook

```

## Setup for production

1. Install [Node.js](https://nodejs.org/) = `v20.10`
2. Install NPM = `10.2`
3. Import this project.
4. Checkout to `master` branch.
5. Install dependencies `npm install`
6. Setup env variables for production build (for example in .end.production file).

### Build project

```

npm run build

```

### Build storybook (optional)

```

npm run build:storybook

````

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Project folders structure

```bash
├── .storybook // Configuration story book
├── public
│   └── storybook
├── src
│   ├── assets
│   │   ├── fonts
│   │   ├── icons
│   │   ├── icons-font
│   │   ├── images
│   │   └── styles
│   │      ├── global
│   │      ├── parts
│   │      ├── tools
│   │      └── ui-framework
│   ├── components
│   │   └── ui-framework // Wrappers for ui-framework components
│   ├── constants // Global constants
│   ├── i18n // Project localization
│   ├── layouts // Global layouts
│   ├── modules  // Project pages/modules
│   │   ├── module-example
|   │   │   ├── components
|   │   │   ├── filters
|   │   │   ├── pages
|   │   │   ├── routes
|   │   │   ├── types
|   │   │   └── utils
│   ├── plugins
│   ├── router
│   │   └── middlewares
│   ├── rules
│   ├── services
│   │   └── requests // Api requests
│   ├── store
│   │   └── modules
│   ├── stories
│   ├── types // Global types and interfaces
│   │   └── interfaces
│   ├── utils // Global utils
│   ├── App.vue
│   ├── main.ts
│   └── config.ts
├── .browserslistrc.js
├── .eslint.js
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

````
