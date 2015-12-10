window.addEventListener('load', () => {
    // we need to redirect the user to authorize us on Pocket
    window.location = [
        'https://getpocket.com/auth/authorize?request_token=',
        window.bag.requestToken,
        '&redirect_uri=',
        window.bag.redirectURI,
        '&mobile=0'
    ].join('');
});
