const wrapValidator = (validator) => (req, res, next) => {
    try {
        validator(req, res, next);
    } catch (err) {
        next(err);
    }
};
export { wrapValidator };
