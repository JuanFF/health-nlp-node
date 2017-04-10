[![Build Status][travis-badge]][travis-badge-url]
[![Coverage Status][coveralls-badge]][coveralls-badge-url]
[![Dependency Status][david-badge]][david-badge-url]
[![devDependency Status][david-dev-badge]][david-dev-badge-url]

[travis-badge]: https://travis-ci.org/fjrd84/health-nlp-node.svg?branch=master
[travis-badge-url]: https://travis-ci.org/fjrd84/health-nlp-node
[coveralls-badge]: https://coveralls.io/repos/github/fjrd84/health-nlp-node/badge.svg?branch=master
[coveralls-badge-url]: https://coveralls.io/github/fjrd84/health-nlp-node?branch=master
[david-badge]: https://david-dm.org/fjrd84/health-nlp-node.svg
[david-badge-url]: https://david-dm.org/fjrd84/health-nlp-node
[david-dev-badge]: https://david-dm.org/fjrd84/health-nlp-node/dev-status.svg
[david-dev-badge-url]: https://david-dm.org/fjrd84/health-nlp-node?type=dev

# health-nlp-node

This repository contains the nodeJS/express based web server of the ***health-nlp*** project.

The ***health-nlp*** project is an NLP (Natural Language Processing) demo composed by the following repositories:

- [health-nlp-angular](https://github.com/fjrd84/health-nlp-angular): frontend part. It displays the results of the analysis (stored in firebase) and explains everything about the project. It is an Angular based web application.
- [health-nlp-node](https://github.com/fjrd84/health-nlp-node): nodeJS/express backend for the health-nlp-angular frontend. It takes new job requests and sends them to the beanstalkd job queue.
- [health-nlp-analysis](https://github.com/fjrd84/health-nlp-analysis) (this repository): it processes jobs from beanstalkd and sends the results to firebase. It is a Python project.

This project is still on an early stage of development. As soon as there's an online demo available, you'll find a link here.


## Get this thing running

This project contains a nodeJS/Express app that gets jobs via a REST API and inserts them into a beanstalkd queue.

### Beanstalkd

The first thing you need is a beanstalkd service.

If you have docker on your system just type `make runqueuedocker` in order to start a dockerized beanstalkd queue.

If you want to install it locally on your system, and you are running a debian based linux distribution, you can install beanstalkd by typing this on the console:

`sudo apt-get install beanstalkd`.

If you're using MacOSX or another linux distribution, just follow the [instructions on the official documentation](http://kr.github.io/beanstalkd/download.html).

In order to start the beanstalkd service, you can type this on the shell:

`beanstalkd -l 127.0.0.1 -p 11300`

Alternatively, `npm run queue` runs exactly that command.

By default, we're using port `11300` and IP `127.0.0.1`. You can change this in the `config.ini` file.

### NPM Dependencies

In order to install the dependencies, you can simply type `npm install`.

### Configuration

TODO

### Run it!

Once beanstalkd is running on your machine and the configuration is ready, you can type `npm start` to start the web server.

## Unit Tests and Coverage

You can run the tests by typing this on the console:

`npm test`

And the you can generate the coverage report with:

`npm coverage`

## Docker

If you want to deploy this service inside Docker containers, you will find the `docker-compose.yml` file on the root directory of this repository.
