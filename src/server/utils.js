const moment = require('moment');

module.exports.log = (s) => {
    console.log('[%s]%s', moment().format('YYYY/MM/DD hh:mm:ss'), s);
};
