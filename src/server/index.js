const express = require('express');
const path = require('path');
const request = require('request');


let requestToken = null;

const start = () => {
    const app = express();

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '/www/html'));
    app.use(express.static(path.join(__dirname, '/www')));

    app.get('/', (req, res) => {
        res.render('index', {
            requestToken,
            'address': 'http://localhost:3000/return'
        });
    });

    app.get('/return', (req, res) => {
        const options = {
            'url': 'https://getpocket.com/v3/oauth/authorize',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json; charset=UTF8',
                'X-Accept': 'application/json'
            },
            'body': JSON.stringify({
                'consumer_key': '48360-6494766ccc3b69770c2747b1',
                'code': requestToken
            })
        };

        request(options, (err, resp) => {
            if (err) {
                console.log(err);
                return;
            }
            let data = null;
            try {
                data = JSON.parse(resp.body);
            } catch (e) {
                console.log(e);
                return;
            }
            res.render('ui', {
                'token': data.access_token,
                'username': data.username
            });
        });

    });

    const server = app.listen(3000, () => {
        const host = server.address().address;
        const port = server.address().port;
        console.log('Pocket request token is: %s', requestToken);
        console.log('Server listening at http://%s:%s', host, port);
    });
};

const options = {
    'url': 'https://getpocket.com/v3/oauth/request',
    'method': 'POST',
    'headers': {
        'Content-Type': 'application/json; charset=UTF8',
        'X-Accept': 'application/json'
    },
    'body': JSON.stringify({
        'consumer_key': '48360-6494766ccc3b69770c2747b1',
        'redirect_uri': 'localhost'
    })
};

request(options, (err, resp) => {
    if (err) {
        console.log(err);
        return;
    }
    try {
        requestToken = JSON.parse(resp.body).code;
    } catch (e) {
        console.log(e);
        return;
    }
    start();
});
