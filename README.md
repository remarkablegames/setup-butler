# setup-butler

[![version](https://badgen.net/github/release/remarkablegames/setup-butler)](https://github.com/remarkablegames/setup-butler/releases)
[![build](https://github.com/remarkablegames/setup-butler/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablegames/setup-butler/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/remarkablegames/setup-butler/graph/badge.svg?token=AAbBz3SIPn)](https://codecov.io/gh/remarkablegames/setup-butler)

🎩 Set up your GitHub Actions workflow with [itch.io](https://itch.io/) [butler](https://itch.io/docs/butler/).

## Quick Start

```yaml
name: setup-butler
on: push
jobs:
  setup-butler:
    runs-on: ubuntu-latest
    steps:
      - name: Setup butler
        uses: remarkablegames/setup-butler@v1
```

## Usage

See [action.yml](action.yml)

**Basic:**

```yaml
- uses: remarkablegames/setup-butler@v1
```

## Inputs

### `butler-version`

**Optional**: The CLI [version](https://broth.itch.ovh/butler). Defaults to `LATEST`:

```yaml
- uses: remarkablegames/setup-butler@v1
  with:
    butler-version: LATEST
```

### `cli-name`

**Optional**: The butler CLI name. Defaults to `butler`:

```yaml
- uses: remarkablegames/setup-butler@v1
  with:
    cli-name: butler
```

## Contributions

Contributions are welcome!

## License

[MIT](LICENSE)
