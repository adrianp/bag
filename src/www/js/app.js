const React = require('react');
const ReactDOM = require('react-dom');

window.addEventListener('load', () => {

    const contentElement = document.getElementById('content');
    ReactDOM.render(
        <h1>Hello {window.bag.pocket.username}! I'm now retrieving your data from Pocket...</h1>,
        contentElement
    );


    window.fetch('api/get', {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            'accessToken': window.bag.pocket.accessToken
        })
    })
    .then((data) => {
        return data.json();
    })
    .then((data) => {
        console.log(data);
        ReactDOM.render(
            <h1>OK, I received data from Pocket!</h1>,
            contentElement
        );
    })
    .catch((err) => {
        console.log(err);
        ReactDOM.render(
            <h1>Well, I could not get your data from Pocket...</h1>,
            contentElement
        );
    });
});

