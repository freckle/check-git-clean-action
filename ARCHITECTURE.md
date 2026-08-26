# Architecture

> [!NOTE]
>
> This file describes the architecture of what is present, in the template,
> which should set up an apps that use this template on a good direction that
> we've seen works well.
>
> As the app grows, you are expected to remove, correct, and fill in details
> about app-specific architecture here.

## Code Organization

This action is organized in the following way:

`run()` is the highest-level interface, but is still unit-testable. Anything it
depends on is provided as an argument. This allows static, mocked, or spied-on
values to be provided in tests (see `run.test.ts`). This is known as _Dependency
Injection_. As such, `main()` should do nothing besides build those
dependencies, invoke `run()`, and handle errors.

`Context` and `getContext()` exists to encapsulate the environment data present
in `github.context`. The internals of `run()` (and the things it calls) should
never call that directly. Instead, the `Context` value should be extended as
necessary.

Similarly, `Inputs` and `getInputs()` exists to encapsulate the `core` calls and
parsing necessary to access action inputs. Keep the parsing logic light, or
separately unit-tested, as it is not exercised by tests on `run()` when static
`Inputs` values are being provided.

One exception is logging. Logging calls (e.g. `core.info`) are convenient to
place through the action, and are a small enough, non-functional surface area to
silence via mocking during unit tests that we prefer that over injecting and
passing `core` itself as another dependency throughout.

Lastly, `GitHubClient` exists as a mockable interface to the GitHub API. It
defines a _mid-level_ interface over any API calls the action needs to make. In
other words, each function of the interface should resemble the API call it
makes, not orchestrate separate calls, though some amount of app-specific logic
is acceptable.

Interaction with other 3rd-party APIs should be implemented in a similar way.
