# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

### Folder Structure
```
└── src/
    ├── components/ -> All non-page components
    │   └── Reviews/
    │        ├── Reviews.tsx -> Main file
    │        └── Reviews.styles.ts -> File for containing files
    ├── constants/ -> All constant files
    │   └── authConstants.ts
    ├── assets/ -> All static assets
    │   └── images/    
    │       ├── iconCheck.png
    │       └── iconBox.svg
    ├── store/ -> For redux configurations
    │   ├── slices/
    │   │   └── authSlice.ts
    │   ├── api/
    │   │   └── authApilice.ts
    │   └── store.ts
    ├── navigation/ -> Route configurations
    ├── pages/ -> Divided made on a module basis
    │   ├── auth/    
    │   │   └── loginPage/
    │   │       ├── loginPage.tsx
    │   │       └── loginPage.styles.ts
    │   └── users/    
    ├── utils/ -> For grouped function files
    │   └── dateTimeutils.ts
    └── hooks/
        ├── usePayment.ts
        ├── useUpdateEmployee.ts
        ├── useEmployees.ts
        └── useAuth.tsx
```