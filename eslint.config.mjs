import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
  {
    languageOptions: {
      globals: globals.browser, // Set global variables (e.g., for the browser environment)
    },
    // Extending recommended ESLint configurations
    plugins: {
      '@stylistic/js': stylisticJs, // Include the stylistic plugin
    },
    rules: {
      // Set stylistic rules
      '@stylistic/js/indent': ['error', 2],
    },
  },
];
