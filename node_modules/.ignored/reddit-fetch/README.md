# reddit-fetch

![Downloads](https://img.shields.io/npm/dm/reddit-fetch)
![Minified size](https://img.shields.io/bundlephobia/min/reddit-fetch)
![Version](https://img.shields.io/github/package-json/v/LilyAsFlora/reddit-fetch)
![License](https://img.shields.io/npm/l/reddit-fetch)

[![NPM](https://nodei.co/npm/reddit-fetch.png)](https://nodei.co/npm/reddit-fetch/)

A simple, fast wrapper for fetching information from reddit posts.

## Usage & Example
```
const redditFetch = require('reddit-fetch');

redditFetch({

    subreddit: 'all',
    sort: 'hot',
    allowNSFW: true,
    allowModPost: true,
    allowCrossPost: true,
    allowVideo: true

}).then(post => {
    console.table(post);
});
```

## Options

| FIELD          | TYPE          | DESCRIPTION                                                         | DEFAULT |
| :------------- |:-------------:|:-------------------------------------------------------------------:|:-------:|
| subreddit      | string        | an existing reddit community                                        | N/A     |
| sort           | ?string       | a valid reddit sorting option                                       | 'top'   |
| allowNSFW      | ?boolean      | whether or not the returned post can be marked as NSFW              | false   |
| allowModPost   | ?boolean      | whether or not the returned post can be distinguished as a mod post | false   |
| allowCrossPost | ?boolean      | whether or not the returned post can be a crosspost                 | false   |
| allowVideo | ?boolean | whether or not the returned post can be a video | false |

## Function details
- Returns a promise that resolves to a JSON object (`Promise<object>`).
- By default, the Reddit JSON API should not return any removed or deleted posts.
- Unhandled rejections can be caught and handled:
```
...
}).then(post => {
    // Use post data
}).catch(e => {
    console.error(`Promise rejection: ${e}`);
});
```

## Additional Links
- [NPM Package](https://npmjs.com/package/reddit-fetch/)
- [Reddit API Documentation](https://www.reddit.com/dev/api/)
- [Handling promise rejections](https://javascript.info/promise-error-handling)
- [Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Reasons to switch to Deno](https://dev.to/victorandcode/should-i-be-using-deno-instead-of-node-js-4h67)
- [JavaScript property accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors)

***
Made with <3 by Lily :)
