import { promisify } from 'util';
import { readFile as _readFile } from 'fs';
import { join } from 'path';
import { Context, Middleware } from 'koa';
import * as ejs from 'ejs';
import LRU from '@zcorky/lru';

declare module 'koa' {
  interface Context {
    render<T extends object>(view: string, state?: T): Promise<void>;
  }
}

const debug = require('debug')('koa-ejs');
const readFile = promisify(_readFile);
// const resolveInclude = ejs.resolveInclude;

export interface Options {
  /**
   * view directory
   */
  dir: string;

  /**
   * view format extension, default .ejs
   */
  ext?: string;

  /**
   * cache compiled functions, default true
   */
  cache?: LRU<string, Function> | false;

  /**
   * compiled debug instrumentation, default false
   */
  compileDebug?: boolean;

  /**
   * output generated function body
   */
  debug?: boolean;

  /**
   * character to use with angle brackets for open/close, default %
   *  example:
   *    <ul>
   *      <% users.forEach(function(user) { %>
   *        <%- include('user/show', { user: user }) %>
   *      <% }); %>
   *    </ul>
   *
   *  if delimiter = '$':
   *    <ul>
   *      <$ users.forEach(function(user) { $>
   *        <$- include('user/show', { user: user }) $>
   *      <$ }); $>
   *    </ul>
   */
  delimiter?: string;

  /**
   * Whether or not to use with() {} constructs.
   * If false then the locals will be stored in the `locals` object. Set to false in strict mode.
   */
  _with?: boolean;

  // locals?: object;

  // scope?: any;
}

const DEFAULTS = {
  cache: new LRU<string, Function>(),
  ext: '.ejs',
  compileDebug: false,
  debug: false,
  locals: {},
};

export default (options: Options): Middleware => {
  const _options = Object.assign({}, DEFAULTS, options);

  return async function koaEjs(ctx: Context, next: () => Promise<void>) {
    if (!ctx.render) {
      ctx.render = render;
    }

    await next();
  };

  async function render<T extends object>(view: string, state?: T) {
    const ctx = this;
    const context = Object.assign({}, ctx.state, state);
    const html = await ejsRender(view, context);

    ctx.type = 'html';
    ctx.body = html;
  };

  async function ejsRender(view: string, state: any): Promise<string> {
    const filename = `${view}${_options.ext}`;
    const filepath = join(_options.dir, filename);

    if (_options.cache && _options.cache.hasKey(filepath)) {
      /* istanbul ignore next */
      debug('render[hit cache]: ', filepath);
      return _options.cache.get(filepath)!.call(state.scope, state);
    }

    debug('render[new]: ', filepath);

    const tpl = await readFile(filepath, 'utf8');

    // override `ejs` node_module `resolveInclude` function
    // (ejs as any).resolveInclude = function (name: string, fileName: string, isDir: boolean) {
    //   return resolveInclude(
    //     !extname(name) ? join(name, _options.ext) : name,
    //     fileName,
    //     isDir,
    //   );
    // }

    const template = ejs.compile(tpl, {
      filename: filepath,
      _with: _options._with,
      debug: _options.debug,
      delimiter: _options.delimiter,
      cache: !!_options.cache,
    });

    if (_options.cache) {
      _options.cache.set(filepath, template);
    }

    return template.call(state.scope, state);
  };
};
