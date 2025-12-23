/**
 * A utility function that wraps an asynchronous Express route handler.
 * It catches any errors that occur in the async function and passes them
 * to the next error-handling middleware.
 *
 * @param {Function} requestHandler - The asynchronous controller function to wrap.
 * @returns {Function} An Express middleware function.
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) =>
            next(err)
        );
    };
};

export { asyncHandler };
