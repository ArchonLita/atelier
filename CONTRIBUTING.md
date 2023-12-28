## How to contribute to Atelier

This project is mainly written in [typescript](https://www.typescriptlang.org/). If you are unfamiliar with this language, it is worth reading the [Typescript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html).

A list of active development efforts can be found in the [projects page](https://github.com/ArchonLita/atelier/projects).

1. Assign yourself to the issue in the project page.

2. Create a new branch to make your code changes. Make sure to include tests to validate your code behaviour, as well as provide an example of how it should be used. After writing up your change, format and lint your code to check for issues.

```sh
git branch <branch name>
git checkout <branch name>
```

```sh
bun format
bun lint
```

3. Push your changes to a new branch, then make a pull request with your changes. Write up a description for your changes and assign it to the issue you were originally working on.

```sh
git push origin <branch name>
```

4. Have someone else review your changes, then merge it into the main branch.
