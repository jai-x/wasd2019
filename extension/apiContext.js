let context;
const get = () => context;
const set = (ctx) => { context = ctx; };
module.exports = { get, set };
