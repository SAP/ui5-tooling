# Development Conventions and Guidelines
## JavaScript Coding Guidelines
We enforce code style rules using [ESLint](https://eslint.org). You may find an integration for your favorite IDE [here](https://eslint.org/docs/user-guide/integrations).

## Git Guidelines
Git guidelines mainly follow the [OpenUI5 guidelines](https://github.com/SAP/openui5/blob/master/docs/guidelines.md).

### Commit Message
The commit message consists of two or three parts, separated by empty lines.

#### Commit Summary
The commit summary is the first line of the commit message.
- It should be 50-70 characters long.
- Must be prefixed by `[FIX]`, `[FEATURE]` or `[INTERNAL]` and should start with the component/module which was the main subject of the change
- Do not use any `[` or `]` within the summary but for the prefixes.

    ```
    [FIX] npm translator: Correct handling of devDependencies

    - devDevependencies should only be included in certain cases
    - Was caused by a refactoring

    Fixes: #42, #45
    ```
