import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import globals from "globals";
import svelteConfig from "./svelte.config.js";

export default defineConfig([
  {
    files: ["**/*.js", "**/*.ts", "**/*.svelte"],
    extends: [
      js.configs.recommended,
      ...ts.configs.strictTypeChecked,
      ...ts.configs.stylisticTypeChecked,
      ...svelte.configs.recommended,
      prettier,
      ...svelte.configs.prettier,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.config.js"],
        },
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".svelte"],
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/return-await": ["error", "always"],
      "@typescript-eslint/no-redundant-type-constituents": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "no-eval": "error",
      "no-implied-eval": "off", // ts version below
      "@typescript-eslint/no-implied-eval": "error",
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "prefer-template": "error",
      "prefer-arrow-callback": "error",
      "no-param-reassign": "error",
      "no-throw-literal": "off", // ts version below
      "@typescript-eslint/only-throw-error": "error",
      "no-return-assign": ["error", "always"],
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",
      "no-useless-concat": "error",
      "no-useless-rename": "error",
      "object-shorthand": "error",
      "prefer-destructuring": ["error", { object: true, array: false }],
      "prefer-spread": "error",
      "prefer-rest-params": "error",

      "svelte/no-useless-mustaches": "error",
      "svelte/require-each-key": "error",
      "svelte/no-at-html-tags": "error",
      "svelte/no-target-blank": "error",
      "svelte/no-reactive-reassign": "error",
      "svelte/require-event-dispatcher-types": "error",
      "svelte/button-has-type": "error",
      "svelte/no-dom-manipulating": "error",
      "svelte/no-store-async": "error",
      "svelte/require-stores-init": "error",
      "svelte/prefer-class-directive": "error",
      "svelte/prefer-style-directive": "error",
      "svelte/shorthand-attribute": "error",
      "svelte/shorthand-directive": "error",
      "svelte/sort-attributes": "error",
      "svelte/spaced-html-comment": "error",
      "svelte/no-unused-class-name": [
        "error",
        { allowedClassNames: ["panel"] },
      ],
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        svelteConfig,
      },
    },
  },
  {
    ignores: [".svelte-kit/", "build/", "node_modules/"],
  },
]);
