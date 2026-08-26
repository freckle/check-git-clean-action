# TypeScript Action Template

Our custom template repository for GitHub Actions implemented in TypeScript.

See [creating a repository from a template][docs]. If you are working within
Freckle, use [github-vending-machine][ghvm] instead.

[docs]: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template
[ghvm]: https://github.com/freckle/github-vending-machine

> [!WARNING]
>
> Be sure to look for strings like "TODO" or "Action name" and update them
> accordingly.

## Usage

```yaml
- uses: freckle/TODO-action@v1
```

<!-- action-docs-inputs action="action.yml" -->

## Inputs

| name           | description                                | required | default               |
| -------------- | ------------------------------------------ | -------- | --------------------- |
| `github-token` | <p>Override GitHub token, if necessary</p> | `true`   | `${{ github.token }}` |

<!-- action-docs-inputs action="action.yml" -->

<!-- action-docs-outputs action="action.yml" -->

<!-- action-docs-outputs action="action.yml" -->

## Permissions

This action requires the following permissions:

```yaml
permissions: {}
```

As the action uses the GitHub API, these should be updated to reflect the
minimal permissions required. These permissions may need to be manually set in
certain scenarios, such as workflows triggered by Dependabot PRs, which use a
read-only `GITHUB_TOKEN`.

## Versioning

Versioned tags will exist, such as `v1.0.0` and `v2.1.1`. Tags will also exist
for each major version, such as `v1` or `v2` and point to the newest version in
that series.

## Release

To trigger a release (and update the `@v{major}` tag), merge a commit to `main`
that follows [Conventional Commits][]. In short,

- `fix:` to trigger a patch release,
- `feat:` to trigger minor, or
- `<type>!:` or add a `BREAKING CHANGE:` trailer to trigger major

We don't enforce conventional commits generally (though you are free do so),
it's only required if you want to trigger release.

[conventional commits]: https://www.conventionalcommits.org/en/v1.0.0/#summary

---

[LICENSE](./LICENSE)
