const fetch = require('node-fetch');


const apiURL = 'https://getpocket.com/v3/';
let requestToken = null;

const getDefaultOptions = () => {
    return {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json; charset=UTF8',
            'X-Accept': 'application/json'
        },
        'body': {
            'consumer_key': '48360-6494766ccc3b69770c2747b1'
        }
    };
};

module.exports.getRequestToken = () => requestToken;

module.exports.get = (accessToken, cb, err) => {
    const options = getDefaultOptions();
    /* eslint-disable camelcase */
    options.body.access_token = accessToken;
    /* eslint-enable camelcase */
    options.body = JSON.stringify(options.body);

    fetch(apiURL + 'get', options)
    .then((data) => data.json())
    .then(cb)
    .catch(err);
};

module.exports.authorize = (cb, err) => {
    if (!requestToken) {
        err(new Error('Attempted to use Pocket before initialization'));
        return;
    }

    const options = getDefaultOptions();
    options.body.code = requestToken;
    options.body = JSON.stringify(options.body);

    fetch(apiURL + 'oauth/authorize', options)
    .then((rawData) => rawData.json())
    .then(cb)
    .catch(err);
};

module.exports.init = (redirectURI, cb, err) => {
    const options = getDefaultOptions();
    /* eslint-disable camelcase */
    options.body.redirect_uri = redirectURI;
    /* eslint-enable camelcase */
    options.body = JSON.stringify(options.body);

    fetch(apiURL + 'oauth/request', options)
    .then((rawData) => rawData.json())
    .then((data) => {
        requestToken = data.code;
        console.log('[Pocket] Request token received:', requestToken);
        cb();
    })
    .catch(err);
};
