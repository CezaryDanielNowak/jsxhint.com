# jshint.com

Requirements: [Node.js](http://nodejs.org)

## Local Development

First install its dependencies using the following command:

    $ npm install

Next, update submodules:

    $ git submodule init
    $ git submodule update

Next, run the site using:

    $ npm start

## Deployment

The site is hosted on [GitHub Pages](https://pages.github.com/). The deployment
process requires [git](http://www.git-scm.com/) and [GNU
Make](https://www.gnu.org/software/make/)

    $ make deploy
