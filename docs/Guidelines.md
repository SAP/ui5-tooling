# Development Conventions and Guidelines
## JavaScript Coding Guidelines
We enforce code style rules using [ESLint](https://eslint.org). Execute `npm run lint` to check your code for style issues.  
You may also find an ESLint integration for your favorite IDE [here](https://eslint.org/docs/user-guide/integrations).

## Testing
Unit testing is based on the [ava](https://github.com/avajs/ava) test-framework. You can run all tests using `npm test` (this is what Travis CI does for pull requests).

During development, you might want to use `npm run unit` or `npm run unit-watch` (re-runs tests automatically after file changes) to quickly execute all unit tests and see whether your change just broke one of them. 😉

## Git Guidelines
### No Merge Commits
Please use [rebase instead of merge](https://www.atlassian.com/git/tutorials/merging-vs-rebasing) to update a branch to the latest master. This helps keeping a clean commit history in the project.

### Commit Message Style
#### Commit Summary
The commit summary is the first line of the commit message.

- It should be **50-70 characters** long.
- It should be **prefixed** by `[FIX]`, `[FEATURE]` or `[INTERNAL]` accordingly, followed by the name of the component or module which was the main subject of the change.
    + Use `[FIX]` for bugfixes.
    + Use `[FEATURE]` for new features / enhancements.
    + Use `[INTERNAL]` for all other changes (e.g. refactorings, documentation, etc.).
    + Exceptions are changes not relevant for the change log, such as commits created by automated processes like releases or dependency updates or minor code style changes
- It must not contain `[` or `]` anywhere but in the prefix.
- It shall be written in **imperative present tense** (as recommended by [Git](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project))  
    + Examples: Instead of *"Adding tests for"* or *"I added tests for"* use *"Add tests for"* or *"Add feature xy"*.

#### Commit Body
After the commit summary there should be an empty line followed by the commit body.

- Describe the intention and reasoning of the change
- If a change fixes an issue reported on GitHub, add the following line to the commit message:
    + `Fixes: #<issueNumber>` (e.g. `Fixes: #42`)

#### Example
```
[FIX] npm translator: Correct handling of devDependencies

- devDevependencies should only be included in certain cases
- Was caused by a refactoring

Fixes: #42
Fixes: #45
```
