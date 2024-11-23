/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/no-unresolved": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/await-thenable": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/only-throw-error": "off",
    "@typescript-eslint/prefer-optional-chain": "off"
  },
};

module.exports = config;