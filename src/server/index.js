const express = require('express');
const path = require('path');


const app = express();

app.use(express.static(path.join(__dirname, '/www')));

const server = app.listen(3000, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
