window.addEventListener('load', () => {
    window.location = 'https://getpocket.com/auth/authorize?request_token=' +
        window.bag.token +
        '&redirect_uri=' +
        window.bag.address +
        '&mobile=0';
});
