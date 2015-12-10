const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const pocket = require('./pocket.js');


const errorHandler = (res, err) => {
    res.status(500).send(err);
};

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/www/html'));
app.use(express.static(path.join(__dirname, '/www')));
app.use(bodyParser.json());

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
        'address': 'http://localhost:3000/return'
    });
});

app.get('/return', (req, res) => {
    pocket.authorize((data) => {
        res.render('ui', {
            'token': data.access_token,
            'username': data.username
        });
    }, (err) => {
        errorHandler(res, err);
    });
});

const start = () => {
    const server = app.listen(3000, () => {
        const host = server.address().address;
        const port = server.address().port;
        console.log('[Server] Listening at: http://%s:%s', host, port);
    });
};

// init pocket (i.e., get request token) and start the server afterwards
pocket.init('http://localhost/', start, console.log.bind(console));
