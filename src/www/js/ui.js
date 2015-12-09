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
.then(console.log.bind(console))
.catch(console.log.bind(console));
