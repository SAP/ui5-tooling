# Troubleshooting
## UI5 Server
### Chrome Redirects HTTP URLs to HTTPS (`ERR_SSL_PROTOCOL_ERROR`)
An HTTPS server or proxy that was previously running on a domain (e.g. `localhost`), might have set an HSTS header, enforcing Chrome to always use HTTPS for this domain. See https://www.chromium.org/hsts. This makes it impossible to connect to an HTTP-only server running on the same domain.

#### Resolution
You need to delete the HSTS mapping in [chrome://net-internals/#hsts](chrome://net-internals/#hsts) by entering the domain name (e.g. `localhost`) and pressing "delete".

## Issues Not Listed Here
Please follow our [Contribution Guidelines](https://github.com/SAP/ui5-tooling/blob/master/CONTRIBUTING.md#report-an-issue) on how to report an issue.

## UI5 Project
### Corrupt Framework Dependencies

When using the UI5 CLI in versions lower than `v2.9.1` or the `@ui5/project` module in versions lower than `v2.2.6` you might experience build- or runtime issues caused by missing or corrupt files in one or more UI5 framework dependencies. Note that this does not affect other project dependencies, such as reuse libraries, which are installed via external package managers like npm or Yarn.

These issues can be the result of an aborted install during a preceding UI5 Tooling execution. Because of [a bug](https://github.com/SAP/ui5-tooling/issues/478) that has since been fixed, UI5 Tooling assumes that the preceding install was successful and uses the potentially corrupted dependency.

#### Resolution

Remove the `.ui5/framework/` directory from your user's home directory.

```sh
rm -rf ~/.ui5/framework/
```

Any missing framework dependencies will be downloaded again during the next UI5 Tooling invocation.

### `~/.ui5` Taking too Much Disk Space

There are possibly many versions of UI5 framework dependencies installed on your system, taking a large amount of disk space.

#### Resolution

Remove the `.ui5/framework/` directory from your user's home directory:

```sh
rm -rf ~/.ui5/framework/
```

Any missing framework dependencies will be downloaded again during the next UI5 Tooling invocation.

## Benchmarking UI5 Tooling

For benchmarking UI5 Tooling we typically make use of the open source tool [hyperfine](https://github.com/sharkdp/hyperfine).

In general we only benchmark calls to the UI5 CLI. However, we might add scripted benchmarks for some components in the future.

The following is a walk-through on how to evaluate the performance impact of an imaginary change in the UI5 Builder project.

### Setup

1. Install [hyperfine](https://github.com/sharkdp/hyperfine#installation)
1. Prepare the UI5 Tooling projects you want to measure *(optional if your development environment already reflects this)*:
    1. Start in an empty directory
        ```sh
        mkdir ui5-tooling-benchmark && cd ui5-tooling-benchmark/
        ```
    1. Clone [UI5 CLI](https://github.com/SAP/ui5-cli)
        ```sh
        git clone git@github.com:SAP/ui5-cli.git
        ```
    1. Clone [UI5 Builder](https://github.com/SAP/ui5-builder) (or your fork)
        ```sh
        git clone git@github.com:SAP/ui5-builder.git
        ```
        Make sure you check out the `master` branch, since we'll perform the baseline test first
    1. Install npm dependencies in both directories
        ```sh
        (cd ui5-cli && npm install)
        (cd ui5-builder && npm install)
        ```
    1. Create global npm links for both projects
        ```sh
        (cd ui5-cli && npm link)
        (cd ui5-builder && npm link)
        ```
    1. Link UI5 Builder into UI5 CLI
        ```sh
        (cd ui5-cli && npm link @ui5/builder)
        ```
    1. Verify your setup
        ```sh
        ui5 --version
        ```
        This should output the version and location of the UI5 CLI you just cloned.

        For example:
        ```
        2.6.6 (from /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js)
        ```

1. Prepare your test project (we choose the [openui5-sample-app](https://github.com/SAP/openui5-sample-app))
    1. Clone the project
        ```sh
        git clone git@github.com:SAP/openui5-sample-app.git
        ```
    1. Navigate into the project
        ```sh
        cd openui5-sample-app
        ```
    1. Install any required npm dependencies
        ```sh
        npm install
        ```
        Note: We won't link UI5 CLI into this project. Instead, we'll call it directly.
    1. Verify that the previously installed UI5 CLI can be called with the following command:
        ```sh
        UI5_CLI_NO_LOCAL=X node /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js --version
        ```
        On Windows:
        ```sh
        set UI5_CLI_NO_LOCAL=X node /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js --version
        ```
        *(Replace the path to ui5.js with the one shown in the previous `ui5 --version` output)*

### Benchmarking

1. Depending on how reliable you'd like the measurements to be, consider preparing your system:
    1. Connect your computer to a power supply
    1. Make sure no updates or anti-virus scans are taking place
    1. Close all applications. This includes your IDE, since it might start indexing any new files created during the build, thus impacting I/O
    1. Don't interact with your system wile the benchmarking is running

1. Perform the baseline measurement
    1. In the project, start your first benchmark
        ```sh
        hyperfine --warmup 1 \
        'UI5_CLI_NO_LOCAL=X node /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js build' \
        --export-markdown ./baseline.md
        ```
        On Windows:
        ```sh
        hyperfine --warmup 1 \
        'set UI5_CLI_NO_LOCAL=X node /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js build' \
        --export-markdown ./baseline.md
        ```
    1. Your baseline benchmark is now stored in `baseline.md` and should look similar to this:

        | Command | Mean [s] | Min [s] | Max [s] | Relative |
        |:---|---:|---:|---:|---:|
        | `UI5_CLI_NO_LOCAL=X node /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js build` | 1.439 ± 0.036 | 1.400 | 1.507 | 1.00 |

1. Prepare your change
    1. Switch to the branch that contains your change
        ```sh
        (cd ../ui5-builder && git checkout my-change)
        ```
    1. If your change requires different npm dependencies, reinstall them
        ```sh
        (cd ../ui5-builder && npm install)
        ```
    1. The link from UI5 CLI is still in place. However, if you have changes in **multiple** UI5 Tooling modules, you might need to `npm link` those again

1. Perform the change measurement
    1. In the project, start your second benchmark
        ```sh
        hyperfine --warmup 1 \
        'UI5_CLI_NO_LOCAL=X node /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js build' \
        --export-markdown ./my_change.md
        ```
        On Windows:
        ```sh
        hyperfine --warmup 1 \
        'set UI5_CLI_NO_LOCAL=X node /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js build' \
        --export-markdown ./my_change.md
        ```
    1. Your change's benchmark is now stored in `my_change.md`

### Compile Results

1. Merge both measurements into one markdown
    1. Either remove the `Relative` column or calculate the relative difference yourself.
    1. You should end up with a markdown like this:
        ```md
        | Command | Mean [s] | Min [s] | Max [s] |
        |:---|---:|---:|---:|
        | `UI5_CLI_NO_LOCAL=X node /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js build` | 1.439 ± 0.036 | 1.400 | 1.507 |
        | `UI5_CLI_NO_LOCAL=X node /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js build` | 1.584 ± 0.074 | 1.477 | 1.680 |
        ```
        Rendering like this:

        | Command | Mean [s] | Min [s] | Max [s] |
        |:---|---:|---:|---:|
        | `UI5_CLI_NO_LOCAL=X node /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js build` | 1.439 ± 0.036 | 1.400 | 1.507 |
        | `UI5_CLI_NO_LOCAL=X node /my/home/ui5-tooling-benchmark/ui5-cli/bin/ui5.js build` | 1.584 ± 0.074 | 1.477 | 1.680 |

1. You can now share these results on GitHub or wherever you might need them.

**Happy benchmarking! 🏎**
