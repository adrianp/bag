const React = require('react');
const ReactDOM = require('react-dom');

class Article extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="article">
                <a className="articleURL" href={this.props.url}>
                    {this.props.title}
                </a>
            </div>
        );
    }
}

class ArticleList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const articles = this.props.data.map((article) => {
            return (
                <Article title={article.given_title}
                         url={article.resolved_url}
                         key={article.item_id} />
            );
        });

        return (
            <div className="articleList">
                {articles}
            </div>
        );
    }
}

window.addEventListener('load', () => {
    const contentElement = document.getElementById('content');
    ReactDOM.render(
        <h1>
            Hello {window.bag.pocket.username}! Fetching data from Pocket...
        </h1>,
        contentElement
    );

    window.fetch('api/get', {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            'accessToken': window.bag.pocket.accessToken,
            'parameters': {
                'state': 'unread'
            }
        })
    })
    .then((data) => {
        return data.json();
    })
    .then((data) => {
        ReactDOM.render(<ArticleList data={data} />, contentElement);
    })
    .catch((err) => {
        console.log(err);
        ReactDOM.render(
            <h1>Well, I could not get your data from Pocket...</h1>,
            contentElement
        );
    });
});

