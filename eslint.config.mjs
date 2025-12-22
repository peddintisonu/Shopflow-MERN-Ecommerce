import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
    // 1. Global Ignores (Must be the first object)
    {
        ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", ".env"],
    },

    // 2. Base Configuration (Applies to everything)
    js.configs.recommended,
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            "prettier/prettier": "error", // Shows Prettier issues as ESLint errors
            "no-unused-vars": "warn",
            "no-console": "off",
        },
    },

    // 3. Frontend Specific Config (React/Browser)
    {
        files: ["frontend/**/*.{js,jsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },

    // 4. Backend Specific Config (Node.js)
    {
        files: ["backend/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },

    // 5. Prettier Clean-up (Must be LAST)
    prettierConfig,
];
