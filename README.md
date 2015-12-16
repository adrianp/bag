Bag - a slim Pocket client for the Web
======================================

Bag is a [Pocket](https://getpocket.com) client written in JavaScript
(ECMAScript 2015 on both server and client-side). It aims to be simple to use,
fast and feature-rich.

A deployed version of Bag can be found at
[getbag.herokuapp.com](https://getbag.herokuapp.com). Being a free Heroku
instance, it might be slow, so please bear with us! :-)


Installation:
=============

```
$ npm run config
```

Please edit the `env.sh` file to include your own details; the most important
one is the Pocket consumer key, which you can get
[here](https://getpocket.com/developer/apps/). Then run:

```
$ source ./env.sh  # you need to run this in every new terminal in which you plan to run the Bag server
$ npm run install-globals
```

This last command will ask for the root password as we need to install
[Gulp](http://gulpjs.com/). Finally run:

```
$ npm install --production
```


Running:
========

```
$ npm start
```

Now you can navigate to [127.0.0.1:3000](http://127.0.0.1:3000/) and start
using Bag. Please use a [fetch API](https://fetch.spec.whatwg.org/) [compliant
browser](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#Browser_compatibility).


Development:
============

```
$ npm install  # install development dependencies
$ gulp  # manual build
$ gulp watch  # live reload
```


Tools:
======

Bag is built using:

* [Node.js](https://nodejs.org)
* [Babel](https://babeljs.io/) for [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/) and [React](https://facebook.github.io/react/)
* [Express](http://expressjs.com/en/index.html)
* [Fetch](https://github.com/github/fetch)
* [EJS](http://www.embeddedjs.com/)
* [Gulp](http://gulpjs.com/)
* [ESLint](http://eslint.org/)


Attribution, Licensing and Contributing:
========================================

Bag is developed by [Adrian-Tudor Panescu](https://github.com/adrianp) and is
using the [MIT license](https://opensource.org/licenses/MIT). Please feel free
to submit [pull requests](https://github.com/adrianp/bag/pulls) and
[issues](https://github.com/adrianp/bag/issues).
