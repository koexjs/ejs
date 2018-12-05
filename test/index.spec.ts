import * as Koa from 'koa';
import * as path from 'path';
import * as request from 'supertest';
import 'should';

import ejs from '../src';

describe('koa static', () => {
  describe('only dir', () => {
    const app = new Koa();
    app.use(ejs({
      dir: path.join(__dirname, 'fixture'),
    }));
    app.use(async ctx => {
      ctx.render.should.be.Function();
      await ctx.render('page');
    });

    it('should render page ok', async () => {
      await request(app.callback())
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<title>koa ejs<\/title>/);
    });
  });

  describe('specify ext, such .html', () => {
    const app = new Koa();
    app.use(ejs({
      dir: path.join(__dirname, 'fixture'),
      ext: '.html',
    }));
    app.use(async ctx => {
      ctx.render.should.be.Function();
      await ctx.render('page');
    });

    it('should render page ok', async () => {
      await request(app.callback())
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<title>with ext .html<\/title>/);
    });
  });

  describe('specify delimiter, such as $', () => {
    const app = new Koa();
    app.use(ejs({
      dir: path.join(__dirname, 'fixture'),
      delimiter: '$',
    }));
    app.use(async ctx => {
      ctx.render.should.be.Function();
      await ctx.render('page.delimiter', {
        title: 'with delimiter $',
      });
    });

    it('should render page ok', async () => {
      await request(app.callback())
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<title>with delimiter \$<\/title>/);
    });
  });

  describe('render with state', () => {
    const app = new Koa();
    app.use(ejs({
      dir: path.join(__dirname, 'fixture'),
    }));
    app.use(async ctx => {
      ctx.render.should.be.Function();
      await ctx.render('page.state', {
        title: 'with state',
        users: [{
          id: 1,
          name: 'user1',
        }, {
          id: 2,
          name: 'user2',
        }, {
          id: 3,
          name: 'user3',
        }],
      });
    });
    const req = request(app.callback());

    it('should render page ok', async () => {
      await req
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<title>with state<\/title>/)
        .expect(/1\.user1/)
        .expect(/2\.user2/)
        .expect(/3\.user3/);

      await req
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<title>with state<\/title>/)
        .expect(/1\.user1/)
        .expect(/2\.user2/)
        .expect(/3\.user3/);
    });
  });

  describe('disable cache', () => {
    const app = new Koa();
    app.use(ejs({
      dir: path.join(__dirname, 'fixture'),
      cache: false,
    }));
    app.use(async ctx => {
      ctx.render.should.be.Function();
      await ctx.render('page.state', {
        title: 'with state',
        users: [{
          id: 1,
          name: 'user1',
        }, {
          id: 2,
          name: 'user2',
        }, {
          id: 3,
          name: 'user3',
        }],
      });
    });

    const req = request(app.callback());

    it('should render page ok', async () => {
      await req
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<title>with state<\/title>/)
        .expect(/1\.user1/)
        .expect(/2\.user2/)
        .expect(/3\.user3/);

      await req
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<title>with state<\/title>/)
        .expect(/1\.user1/)
        .expect(/2\.user2/)
        .expect(/3\.user3/);
    });
  });
});
