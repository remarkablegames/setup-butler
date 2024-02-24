# setup-butler

[![version](https://badgen.net/github/release/remarkablegames/setup-butler)](https://github.com/remarkablegames/setup-butler/releases)
[![build](https://github.com/remarkablegames/setup-butler/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablegames/setup-butler/actions/workflows/build.yml)

🎩 Set up your GitHub Actions workflow with [itch.io](https://itch.io/) [butler](https://itch.io/docs/butler/).

## Quick Start

```yaml
name: setup-butler
on: push
jobs:
  setup-butler:
    runs-on: ubuntu-latest
    steps:
      - name: Setup setup-butler
        uses: remarkablegames/setup-butler@v1
```

## Usage

See [action.yml](action.yml)

**Basic:**

```yaml
- uses: remarkablegames/setup-butler@v1
```

## Inputs

### `cli-version`

**Optional**: The CLI [version](https://github.com/cli/cli/releases). Defaults to [`2.33.0`](https://github.com/cli/cli/releases/tag/v2.33.0):

```yaml
- uses: remarkablegames/setup-butler@v1
  with:
    cli-version: 2.33.0
```

### `cli-name`

**Optional**: The htmlq CLI name. Defaults to `gh`:

```yaml
- uses: remarkablegames/setup-butler@v1
  with:
    cli-name: gh
```

## Contributions

Contributions are welcome!

## License

[MIT](LICENSE)
