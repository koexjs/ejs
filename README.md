# ejs

[![NPM version](https://img.shields.io/npm/v/@koex/ejs.svg?style=flat)](https://www.npmjs.com/package/@koex/ejs)
[![Coverage Status](https://img.shields.io/coveralls/koexjs/ejs.svg?style=flat)](https://coveralls.io/r/koexjs/ejs)
[![Dependencies](https://img.shields.io/david/koexjs/ejs.svg)](https://github.com/koexjs/ejs)
[![Build Status](https://travis-ci.com/koexjs/ejs.svg?branch=master)](https://travis-ci.com/koexjs/ejs)
![license](https://img.shields.io/github/license/koexjs/ejs.svg)
[![issues](https://img.shields.io/github/issues/koexjs/ejs.svg)](https://github.com/koexjs/ejs/issues)

> ejs for koa extend.

### Install

```
$ npm install @koex/ejs
```

### Usage

```javascript
// See more in test
import * as path from 'path';
import ejs from '@koex/ejs';

import * as Koa from 'koa';
const app = new Koa();

app.use(ejs({
  dir: path.join(__dirname, './view'),
}));

app.use(ctx => {
  ctx.render('index');
});

app.listen(8000, '0.0.0.0', () => {
  console.log('koa server start at port: 8000');
});
```

### Related
* [koa-ejs](https://github.com/koajs/ejs)
* [ejs](https://github.com/mde/ejs)