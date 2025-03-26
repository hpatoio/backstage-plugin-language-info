# Language info processor

This plugin add a processor that extract the version of the language used by the service.

**Available processor** | More will come

- PHP | Search the PHP version in the `composer.json` file for components tagged with `php`
- JS | Search the Node version in the `package.json` file for components tagged with `js`

## Installation

```bash
yarn --cwd packages/backend add @hpatoio/backstage-plugin-language-info-processor
```

Then add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();

backend.add(import("@hpatoio/backstage-plugin-language-info-processor"));
```

# Dependencies

This plugin requires [`@hpatoio/backstage-plugin-language-info-card`](../backstage-plugin-language-info-card).
