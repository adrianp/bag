const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const config = require('./config.json');
const pocket = require('./pocket.js');
const utils = require('./utils.js');


const errorHandler = (res, err) => {
    res.status(500).send(err);
};

const requestLogger = (req, res, next) => {
    utils.log(`[Server] ${req.method} request: ${req.url}`);
    next();
};

const url = `http://${config.address}:${config.port}`;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/www/html'));
app.use(express.static(path.join(__dirname, '/www')));
app.use(bodyParser.json());

app.post('*', requestLogger);
app.get('*', requestLogger);

app.post('/api/get', (req, res) => {
    pocket.get(req.body.accessToken, (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    }, (err) => {
        errorHandler(res, err);
    });
});

app.get('/', (req, res) => {
    res.render('index', {
        'requestToken': pocket.getRequestToken(),
        'redirectURI': `${url}/app`
    });
});

app.get('/app', (req, res) => {
    pocket.authorize((data) => {
        res.render('app', {
            'accessToken': data.access_token,
            'username': data.username
        });
    }, () => {
        res.redirect('/');
    });
});

const start = () => {
    app.listen(config.port, config.address, () => {
        utils.log(`[Server] Listening at: ${url}`);
    });
};

// init pocket (i.e., get request token) and start the server afterwards
pocket.init(url, start, console.log.bind(console));
