'use strict';

const FetchError = require('./errors/FetchError.js');
const fetch = require('node-fetch');

/**
 * Makes a HTTP GET request to retrieve JSON data from a post of the specified subreddit.
 *
 * @param {Object} options - Function options.
 * @param {string} options.subreddit - The target subreddit to retrieve the post from.
 * @param {string?} [options.sort] - The sorting option to search for data.
 * @param {boolean?} [options.allowNSFW] - Whether or not the returned post can be marked as NSFW.
 * @param {boolean?} [options.allowModPost] - Whether or not the returned post can be distinguished as a moderator post.
 * @param {boolean?} [options.allowCrossPost] - Whether or not the returned post can be a crosspost.
 * @param {boolean?} [options.allowVideo] - Whether or not the returned post can be a video.
 *
 * @returns {Promise<object>} Promise that resolves to a JSON object value.
 */

module.exports = async function redditFetch({ subreddit, sort = 'top', allowNSFW, allowModPost, allowCrossPost, allowVideo }) {
    return new Promise((resolve, reject) => {

        // Check the required 'subreddit' argument.
        // This argument must be given for the fetch to work.

        if (!subreddit)
            return reject(new Error('Missing required argument "subreddit"'));

        // Validate the remaining options.
        // Ideally, all of these should be passed in as booleans.

        // SUBREDDIT
        if (typeof(subreddit) !== 'string')
            return reject(new TypeError(`Expected type "string" but got "${typeof(subreddit)}"`));

        // SORT
        if (sort && typeof(sort) !== 'string')
            return reject(new TypeError(`Expected type "string" but got "${typeof(sort)}"`));

        // ALLOW NSFW
        if (allowNSFW && typeof(allowNSFW) !== 'boolean')
            return reject(new TypeError(`Expected type "boolean" but got "${typeof(allowNSFW)}"`));

        // ALLOW MOD POST
        if (allowModPost && typeof(allowModPost) !== 'boolean')
            return reject(new TypeError(`Expected type "boolean" but got "${typeof(allowModPost)}"`));

        // ALLOW CROSSPOST
        if (allowCrossPost && typeof(allowCrossPost) !== 'boolean')
            return reject(new TypeError(`Expected type "boolean" but got "${typeof(allowCrossPost)}"`));

        // ALLOW VIDEO
        if (allowVideo && typeof(allowVideo) !== 'boolean')
            return reject(new TypeError(`Expected type "boolean" but got "${typeof(allowVideo)}"`));

        // Convert sorting option & subreddit option to lowercase.
        // This is primarily for the target URL to make the request to.

        sort = sort.toLowerCase();
        subreddit = subreddit.toLowerCase();

        // Target URL for the GET request
        // This is where the main fetch function will grab data.

        const targetURL = `https://reddit.com/r/${subreddit}.json?sort=${sort}&t=week`;

        // @ts-ignore: No, this expression is in fact callable.
        fetch(targetURL).then(res => res.json())
            .then(body => {

                // Array of found posts.
                // Each element should be a large object of returned, unfiltered post data.

                let found = body.data.children;

                // Reject if no posts were found.
                // If no post data could be found it's likely that the subreddit does not exist or it has no submissions.

                if (!found.length)
                    return reject(new FetchError(`Unable to find a post. The subreddit "${subreddit}" does not exist, or it has no available post data.`));

                // Apply options by filtering the array for data with specific values.
                // These values can be any type, though most commonly boolean.

                if (!allowNSFW)
                    found = found.filter(p => !p.data.over_18);

                if (!allowModPost)
                    found = found.filter(p => !p.data.distinguished);

                if (!allowCrossPost)
                    found = found.filter(p => !p.data.crosspost_parent_list);

                if (!allowVideo)
                    found = found.filter(p => !p.is_video);

                // Reject if the found array has no elements.
                // Nothing was found that suits the options specified.

                if (!found.length)
                    return reject(new FetchError('Unable to find a post that meets specified criteria. There may be an error in the options passed in.'));

                // Get a random post object from the array of found data.
                // This data will be resolved and returned through the promise.

                let randInt = Math.floor(Math.random() * found.length);
                resolve(found[randInt].data);

            });
    });
};