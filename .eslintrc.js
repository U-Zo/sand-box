module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard-with-typescript", "plugin:prettier/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    project: ["./tsconfig.json"],
    sourceType: "module",
  },
  rules: {
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "sort-imports": ["error", { ignoreDeclarationSort: true }],
  },
};
