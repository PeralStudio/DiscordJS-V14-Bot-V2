# Sourcebin

[![](https://img.shields.io/npm/v/sourcebin?label=Latest%20Version&style=for-the-badge&logo=npm&color=informational)](https://www.npmjs.com/package/sourcebin)
[![](https://img.shields.io/static/v1?label=Project%20Creator&message=GHOST&color=informational&style=for-the-badge)](https://ghostdev.xyz)
[![](https://img.shields.io/github/workflow/status/ghostdevv/sourcebin/Test%20Suite%20CI?style=for-the-badge)](https://github.com/ghostdevv/sourcebin)

Fast and simple package to get and create bins from [sourcebin](https://sourceb.in/)

# Requirements

```
NodeJS >= 14.x
```

# Install

```
npm install sourcebin
```

# Docs

This README is the best place to learn how to use this package, you can also [take a look at our API docs](https://ghostdevv.github.io/sourcebin/index.html)

# Setup

```js
// Import individual methods
import { create, get, url } from 'sourcebin';

// Import all methods
import * as sourcebin from 'sourcebin';

// Use required
const { create, get, url } = require('sourcebin');
```

# Get a bin

`get(options)`

```js
const bin = await get({
    key: 'qXO2NVhRc6'
});
```

## Options

| Option         | Description                       | Default | Required |
|----------------|-----------------------------------|---------|----------|
| `key`          | The key to get                    | n/a     | ✅       |
| `fetchContent` | Should the bin content be fetched | `true`  | ❌       |

# Create a bin

`create(options)`

```js
const bin = await create(
    {
        title: 'bin name',
        description: 'test bin',
        files: [
            {
                content: 'Hello World',
                language: 'text',
            },
        ],
    },
);
```

## Options

| Option         | Description            | Required |
|----------------|------------------------|----------|
| `title`        | Title of the bin       | ❌       |
| `description`  | Description of the bin | ❌       |
| `files`        | Bin files - see below  | ✅       |

### File Options

| Option         | Description                      | Default | Required |
|----------------|----------------------------------|---------|----------|
| `content`      | Contents of the file             | n/a     | ✅       |
| `language`     | What language should the file be | `text`  | ❌       |

# Url Helper

If you want to get information about a bin try the `url` function.

```js
const urlData = url('iQznILdZRP');

// or

const urlData = url('https://sourceb.in/iQznILdZRP');
```

This returns an object that looks like:

```js
{
  key: 'iQznILdZRP',
  url: 'https://sourceb.in/iQznILdZRP',
  short: 'http://srcb.in/iQznILdZRP'
}
```

# FAQ

-   ## Multiple files in one bin

    This is not currently possible with this wrapper as sourcebin doesn't have a token system for authentication, only pro users are able to have multiple files in one bin. This may come in the future

-   ## Migrate from v4 to v5

    v5 is a overhaull of `sourcebin` so we changed some apis.

    ### Get a bin

    Instead of passing the `key` then `options` it's now one object.

    ```diff
    - const bin = await get('qXO2NVhRc6');
    + const bin = await get({ key: 'qXO2NVhRc6' });

    - const bin = await get('qXO2NVhRc6', { fetchContent: false });
    + const bin = await get({ key: 'qXO2NVhRc6', fetchContent: false });
    ```

    ### Create a bin

    We also unified the options for this function:
    
    ```diff
    - const bin = await create(
    -    [
    -        {
    -            content: 'Hello World',
    -            language: 'text',
    -        },
    -    ],
    -    {
    -        title: 'bin name',
    -        description: 'test bin',
    -    },
    - );

    + const bin = await create(
    +   {
    +       title: 'bin name',
    +       description: 'test bin',
    +       files: [
    +           {
    +               content: 'Hello World',
    +               language: 'text',
    +           },
    +       ],
    +   }
    +  );
    ```

# Support

-   Join the [discord](https://discord.gg/2Vd4wAjJnm)
-   Create a issue on the [github](https://github.com/ghostdevv/sourcebin)
