const CatchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {next(err.message);});
    };
};
module.exports = CatchAsync;