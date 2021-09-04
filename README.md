# bomo

An open source take on the classic Mattel card game UNO, playable via web browser.

<!-- Features include a lobby browser, private lobbies, control over gameplay mechanics, per game chat, LetsEncrypt support, login via oauth, and a documented API.

To play, visit the public server at <url>, or setup your own. -->

## contributing

See our [issue tracker](https://github.com/mechabubba/bomo/issues) for feature requests, bug reports, etc.

<!-- If you want to contribute yourself,  -->

## install

- Install [node.js](https://nodejs.org), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) or [pnpm](https://pnpm.io/installation), and [git](https://git-scm.com/downloads)
- Clone via `git clone https://github.com/mechabubba/bomo.git`
- Run `npm install` or `pnpm install` in the root to install dependencies
- If you want, copy & rename `template.env` to `.env` to edit whatever variables you want before starting. If you don't, it'll do this for you without changing anything
- Run `node index.js` or `npm start` to start the server and you're good to go
- To change the port or persist data to a database, edit your `.env` file
  - The `DB` variable is a [keyv connection string](https://www.npmjs.com/package/keyv#usage). Read up on usage there and make sure to install the appropriate storage adapter as a dependency
- environment variables are strings, not json. so DEV=false wouldn't work and Boolean("false") is true, but DEV= and Boolean(process.env.dev) is false, simple solution is use process.env.dev === "true" which will be true if true and false if anything else

## update

<!-- - `git checkout .` can be used to discard any uncommitted changes you've made, like installing a keyv storage adapter. Just reinstall after running `git pull origin` -->

- Run `git pull origin`

- Manually update your `.env` file if any new variables were added in `template.env` and you're good to go

<!-- ## documentation

Notes for when it gets written:

- I make use of `@todo` to leave notes and tasks awaiting completion/resolution

- If you get `"message": "this.engines[options.ext] is not a function"` and a 500 Internal Server Error, check your `res.render()` calls. You might have missed including the extension `.ejs` or misspelled the template's name

- `ctrl` + `shift` + `r` forces a complete page refresh in firefox, helpful for clearing cached css

- set DEV to true in your environment to have sirv files served fresh

- Documentation
  - [tinyhttp](https://tinyhttp.v1rtl.site/docs)
    - [Details on route matching via regexparam](https://github.com/lukeed/regexparam)
  - [ejs](https://ejs.co/#docs)
  - [keyv](https://www.npmjs.com/package/keyv#usage) & [keyv.js.org](https://keyv.js.org/)
  - [jsdoc](https://jsdoc.app/)

- [The Twelve-Factor App](https://12factor.net/), good guidance regarding app design
- [restfulapi.net](https://restfulapi.net/), good guidance regarding api design
- [stackoverflow.blog's Best practices for REST API design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/), good article on rest apis
-->

## disclaimer

This project is not associated with UNO, Mattel, or Ubisoft in any way.

## credits & attributions

- [UNO](https://www.mattelgames.com/en-us/cards/uno)® by Mattel, Inc for inspiration
- [Silk Icons](http://www.famfamfam.com/lab/icons/silk/), an icon set by [Mark James](https://github.com/markjames/)
- [Node.js](https://nodejs.org)® JavaScript runtime
- [npm](https://npmjs.com), JavaScript package manager
- [pnpm](https://pnpm.io/), fast & disk space efficient JavaScript package manager
- [eslint](https://eslint.org/), a configurable JavaScript linter
- [JSDoc](https://jsdoc.app/), inline JavaScript documentation & docs generation
- [minami](https://github.com/nijikokun/minami), a clean template theme for JSDoc 3
- [pngcrush](https://pmt.sourceforge.io/pngcrush/), an optimizer for PNG files
- [The Twelve-Factor App](https://12factor.net/), good guidance regarding app design
- [restfulapi.net](https://restfulapi.net/), good guidance regarding api design
- [stackoverflow.blog's Best practices for REST API design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/), good article on rest apis
- [TopHattWaffle](https://twitter.com/tophattwaffle) for [this photo](https://twitter.com/tophattwaffle/status/993234368540954625) of their [3D printed source engine errors](https://www.etsy.com/listing/597289214/developer-error-source-engine). Used on the 404 page

Dependencies

- [tinyhttp](https://tinyhttp.v1rtl.site), a lightweight express-like web framework
- [ejs](https://ejs.co), embedded JavaScript templating
- [keyv](https://www.npmjs.com/package/keyv), simple key-value storage with support for multiple backends
- [Luxon](https://moment.github.io/luxon/), modern wrapper for JavaScript dates and times
- [sirv](https://www.npmjs.com/package/sirv), lightweight middleware for serving static assets
- [dotenv](https://www.npmjs.com/package/dotenv), zero-dependency module for `.env` file support
<!-- - [jQuery](https://jquery.com/), feature rich javaScript library for browsers -->
<!-- - [cdnjs](https://cdnjs.com/), reliable content delivery network -->

Extensions

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), visual studio code extension by Dirk Baeumer
- [EJS language support](https://marketplace.visualstudio.com/items?itemName=DigitalBrainstem.javascript-ejs-support), visual studio code extension by DigitalBrainstem
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), an opinionated code formatter (visual studio code extension)
