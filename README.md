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
        uses: remarkablegames/setup-butler@v1

      - name: Upload to itch.io
        # https://itch.io/docs/butler/pushing.html
        run: butler push directory user/game:channel
        env:
          BUTLER_API_KEY: ${{ secrets.BUTLER_API_KEY }}
```

The `BUTLER_API_KEY` is your [itch.io API key](https://itch.io/user/settings/api-keys).

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

**Optional**: The CLI name. Defaults to `butler`:

```yaml
- uses: remarkablegames/setup-butler@v1
  with:
    cli-name: butler
```

## Examples

- [remarkablegames/phaser-template](https://github.com/remarkablegames/phaser-template/blob/master/.github/workflows/release-please.yml)
- [remarkablegames/renpy-template](https://github.com/remarkablegames/renpy-template/blob/master/.github/workflows/release-please.yml)

## Contributions

Contributions are welcome!

## License

[MIT](LICENSE)
