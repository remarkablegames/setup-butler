# setup-butler

[![version](https://badgen.net/github/release/remarkablegames/setup-butler)](https://github.com/remarkablegames/setup-butler/releases)
[![build](https://github.com/remarkablegames/setup-butler/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablegames/setup-butler/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/remarkablegames/setup-butler/graph/badge.svg?token=AAbBz3SIPn)](https://codecov.io/gh/remarkablegames/setup-butler)

🎩 Set up your GitHub Actions workflow with [itch.io](https://itch.io/) [butler](https://itch.io/docs/butler/).

## Quick Start

```yaml
name: Upload to itch.io
on: push
jobs:
  itchio-upload:
    runs-on: ubuntu-latest
    steps:
      - name: Setup butler
        uses: remarkablegames/setup-butler@v2

      # https://itch.io/docs/butler/pushing.html
      - name: Upload to itch.io
        run: butler push directory user/game:channel
        env:
          BUTLER_API_KEY: ${{ secrets.BUTLER_API_KEY }}
```

The `BUTLER_API_KEY` is your [itch.io API key](https://itch.io/user/settings/api-keys).

## Usage

**Basic:**

```yaml
- uses: remarkablegames/setup-butler@v2
```

See [action.yml](action.yml)

## Inputs

### `butler-version`

**Optional**: The CLI [version](https://broth.itch.zone/butler). Defaults to `LATEST`:

```yaml
- uses: remarkablegames/setup-butler@v2
  with:
    butler-version: LATEST
```

### `cli-name`

**Optional**: The CLI name. Defaults to `butler`:

```yaml
- uses: remarkablegames/setup-butler@v2
  with:
    cli-name: butler
```

## Examples

- [phaser-template](https://github.com/remarkablegames/phaser-template/blob/master/.github/workflows/release-please.yml)
- [renpy-template](https://github.com/remarkablegames/renpy-template/blob/master/.github/workflows/release-please.yml)

## License

[MIT](LICENSE)
