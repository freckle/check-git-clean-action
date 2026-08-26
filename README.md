# Check Git Clean

Fails if the working tree is dirty. Run it after a build to assert that
committed artifacts — `dist/`, generated code, lockfiles — match what the build
actually produces.

It is a composite action: one `git status` in `action.yml`, no bundle, nothing
to build or release beyond a tag.

## Where to put it

In the caller's **`ci.yml`**, on `pull_request`, immediately after the build —
not in `release.yml`.

The point is to fail before a merge. A release workflow runs after merge on
`main`, where a stale artifact is already in, so a check there reports a problem
you can no longer prevent. It is also actively harmful mid-release: publish
steps may already have run, leaving a half-published version.

Once a stale artifact cannot merge, `main` is clean by construction and the
release has nothing left to correct — which is what makes it safe to drop
`@semantic-release/git` and its push back to `main`.

Keeping the `push: branches: main` trigger means the check also runs after
merge, which catches anything that reached `main` without passing a PR — a
ruleset bypass actor, for instance.

## Usage

The action only runs `git`, so it is package-manager agnostic — the toolchain
only appears in the steps before it, and in the `hint` it echoes back.

### yarn

```yaml
# .github/workflows/ci.yml
on:
  pull_request:
  push:
    branches: main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          cache: yarn
          node-version-file: .nvmrc
      - run: yarn install
      - run: yarn build
      - uses: freckle/check-git-clean-action@v1
        with:
          hint: "Run yarn build to update your dist/"
```

### pnpm

```yaml
- uses: actions/checkout@v7
- uses: pnpm/action-setup@v6
- uses: actions/setup-node@v7
  with:
    cache: pnpm
    node-version-file: .nvmrc
- run: pnpm install
- run: pnpm build
- uses: freckle/check-git-clean-action@v1
  with:
    hint: "Run pnpm build to update your dist/"
```

`hint` is optional; without it the failure message just says the tree is not
clean.

<!-- action-docs-inputs action="action.yml" -->

## Inputs

| name   | description                                                                                      | required | default |
| ------ | ------------------------------------------------------------------------------------------------ | -------- | ------- |
| `hint` | <p>Message appended when the working tree is dirty, e.g. Run yarn build to update your dist/</p> | `false`  | `""`    |

<!-- action-docs-inputs action="action.yml" -->

<!-- action-docs-outputs action="action.yml" -->

<!-- action-docs-outputs action="action.yml" -->

## What counts as dirty

Detection is `git status --porcelain --untracked-files=normal`, so every way a
build can drift is caught:

| Change to a committed artifact  | Detected |
| ------------------------------- | -------- |
| Modified                        | yes      |
| Deleted                         | yes      |
| Mode changed (e.g. `chmod +x`)  | yes      |
| New / untracked                 | yes      |
| Type changed (file <-> symlink) | yes      |

The untracked row is why this uses `git status` rather than the more obvious
`git diff --exit-code`: a diff never shows untracked files, so a build emitting
a brand new artifact would pass a diff-based check. Conversely, staging first to
make untracked files visible to `git diff` hides deletions instead, because
staging records the removal. Only `git status` sees every case.

`--untracked-files` is passed explicitly rather than left to default, so a
caller whose git config sets `status.showUntrackedFiles=no` still gets the
untracked row above — the row that is the entire reason this is `status` and not
`diff`.

Anything matched by `.gitignore` is excluded, so installing dependencies does
not trip the check.

On failure the action logs the porcelain status plus `git diff HEAD` — against
`HEAD` so staged changes appear too — and fails the job.

If `git` itself fails — no repository at the workspace root, because the caller
checked out to a `path:` subdirectory, or a container job that trips git's
ownership check — the action fails with git's own message. It does not report a
clean tree.

### Limitations

- **Only tracked artifacts are protected.** If a generated directory is
  gitignored there is nothing to compare, and the check passes silently
  forever. It asserts that what is committed matches the build; it does not
  assert that anything is committed.
- **It assumes the build succeeded.** A build that fails without emitting
  anything leaves the tree clean. The build step's own exit code is what
  catches that; this check is not a substitute.
- **Mode changes depend on `core.fileMode`.** Linux runners have it on, so
  `chmod +x` drift is caught. Windows runners do not, and there it is invisible.
- **`.gitattributes` filters apply.** Normalization such as `text=auto` is
  honoured, so a build emitting different line endings may correctly show no
  change.
- **Submodules follow their `.gitmodules` `ignore` setting**, so a dirty
  submodule may or may not register.

## Permissions

This action requires no permissions and no token — it shells out to `git`
against the already-checked-out tree and never calls the GitHub API.

```yaml
permissions: {}
```

## Tests

`ci.yml` is the test suite. Its `build` job runs the action against a clean
tree, then dirties the tree one way at a time — untracked, modified, deleted,
mode-changed, type-changed, and gitignored-only noise — asserting the outcome
each time and restoring the tree after. It exercises the action exactly as a
caller does, which a unit test of extracted logic could not.

Two cases cover the `hint`, which is the part with a sharp edge. The metacharacter
case asserts that the files an executed hint _would_ have created do not exist,
because the tree is already dirty and so the step's outcome alone cannot tell a
quoted hint from an executed one. The other passes a multi-line hint containing
`%` to exercise the annotation escaping.

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
