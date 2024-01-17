
const Logger_MDW = (req, res, next) => {
    console.log(`LOGGER MIDDLEWARE`);
    next();
}

export default Logger_MDW;