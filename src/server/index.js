const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const moment = require('moment');
const path = require('path');

const pocket = require('./pocket.js');
const utils = require('./utils.js');


const errorHandler = (res, err) => {
    res.status(500).send(err);
};

const requestLogger = (req, res, next) => {
    utils.log(`[Server] ${req.method} request: ${req.url}`);
    next();
};

const url = process.env.url;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/www/html'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/www')));

app.post('*', requestLogger);
app.get('*', requestLogger);

app.post('/api/get', (req, res) => {
    pocket.get(req.body.accessToken, req.body.parameters, (data) => {
        res.setHeader('Content-Type', 'application/json');
        const articleList = Object.keys(data.list).map((key) => data.list[key]);
        res.send(JSON.stringify(articleList));
    }, (err) => {
        errorHandler(res, err);
    });
});

app.post('/api/send', (req, res) => {
    pocket.send(req.body.accessToken, req.body.actions, (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    }, (err) => {
        errorHandler(res, err);
    });
});

app.get('/', (req, res) => {
    if (req.cookies.pocketAccessToken) {
        res.redirect(307, '/app');
    } else {
        res.redirect(307, [
            'https://getpocket.com/auth/authorize?request_token=',
            pocket.getRequestToken(),
            '&redirect_uri=',
            `${url}/app`,
            '&mobile=0'
        ].join(''));
    }
});

app.get('/app', (req, res) => {
    const finish = (accessToken, username) => {
        res.render('app', {accessToken, username});
    };

    if (req.cookies.pocketAccessToken) {
        finish(req.cookies.pocketAccessToken, req.cookies.pocketUser);
    } else {
        pocket.authorize((data) => {
            const [token, username] = [data.access_token, data.username];
            const cookieOptions = {
                'maxAge': moment.duration(1, 'years').asMilliseconds()
            };
            res.cookie('pocketAccessToken', token, cookieOptions);
            res.cookie('pocketUser', username, cookieOptions);
            finish(token, username);
        }, (err) => {
            console.log('[Server] Pocket authorize error: ', err);
            res.redirect(307, '/');
        });
    }
});

const start = () => {
    const server = app.listen(process.env.PORT || 3000, () => {
        const address = server.address();
        utils.log(`[Server] Listening at: ${address.address}:${address.port}`);
    });
};

// init pocket (i.e., get request token) and start the server afterwards
pocket.init(url, start, console.log.bind(console));
