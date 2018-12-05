# koa-ejs

[![NPM version](https://img.shields.io/npm/v/@zcorky/koa-ejs.svg?style=flat)](https://www.npmjs.com/package/@zcorky/koa-ejs)
[![Coverage Status](https://img.shields.io/coveralls/zcorky/koa-ejs.svg?style=flat)](https://coveralls.io/r/zcorky/koa-ejs)
[![Dependencies](https://david-dm.org/@zcorky/koa-ejs/status.svg)](https://david-dm.org/@zcorky/koa-ejs)
[![Build Status](https://travis-ci.com/zcorky/koa-ejs.svg?branch=master)](https://travis-ci.com/zcorky/koa-ejs)
![license](https://img.shields.io/github/license/zcorky/koa-ejs.svg)
[![issues](https://img.shields.io/github/issues/zcorky/koa-ejs.svg)](https://github.com/zcorky/koa-ejs/issues)

> ejs for Koa, wrapper with ejs.

### Install

```
$ npm install @zcorky/koa-ejs
```

### Usage

```javascript
// See more in test
import * as path from 'path';
import ejs from '@zcorky/koa-ejs';

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