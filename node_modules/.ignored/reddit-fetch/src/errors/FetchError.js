/**
 * Represents an error that would be thrown when the main request fails.
 * @extends {Error}
 */
class FetchError extends Error {
    /**
     * @param {string} message The error message.
     */
    constructor(message) {
        super();
        this.message = message;
        this.name = 'FetchError';
    }
}

module.exports = FetchError;