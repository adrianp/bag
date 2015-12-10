const React = require('react');
const ReactDOM = require('react-dom');


const buildDom = () => {
    ReactDOM.render(
        <h1>Hello, world!</h1>,
        document.getElementById('content')
    );
};

window.fetch('api/get', {
    'method': 'post',
    'headers': {
        'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
        'accessToken': window.bag.accessToken
    })
})
.then((data) => {
    return data.json();
})
.then((data) => {
    console.log(data);
    buildDom();

})
.catch(console.log.bind(console));
