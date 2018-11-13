// flow-typed signature: 64fc5d8d6fd1ff8a9f72af0a746d3b63
// flow-typed version: 2e881f38e0/koa-route_v3.2.x/flow_>=v0.25.x

declare module "koa-route" {
  declare type Koa$Middleware = (
    ctx: any,
    next: () => Promise<void>
  ) => Promise<void> | void;

  declare interface Koa$RegExpOptions {
    sensitive?: boolean;
    strict?: boolean;
    end?: boolean;
    delimiter?: string;
    endsWith?: string | string[];
  }

  declare interface Koa$ParseOptions {
    delimiter?: string;
    delimiters?: string | string[];
  }

  declare type RoutePath = string | RegExp | Array<string | RegExp>;

  declare type RouteHandler = (self: any, ctx: any, ...params: any[]) => any;

  declare type CreateRoute = (routeFunc: RouteHandler) => Koa$Middleware;

  declare interface RouteMethod {
    (path: RoutePath): CreateRoute;
    (
      path: RoutePath,
      fn: RouteHandler,
      opts?: Koa$ParseOptions & Koa$RegExpOptions
    ): Koa$Middleware;
  }

  declare type CreateRouteMethod = (method: string) => RouteMethod;

  declare interface KoaRoutes {
    all: CreateRouteMethod;
    acl: RouteMethod;
    bind: RouteMethod;
    checkout: RouteMethod;
    connect: RouteMethod;
    copy: RouteMethod;
    delete: RouteMethod;
    del: RouteMethod;
    get: RouteMethod;
    head: RouteMethod;
    link: RouteMethod;
    lock: RouteMethod;
    msearch: RouteMethod;
    merge: RouteMethod;
    mkactivity: RouteMethod;
    mkcalendar: RouteMethod;
    mkcol: RouteMethod;
    move: RouteMethod;
    notify: RouteMethod;
    options: RouteMethod;
    patch: RouteMethod;
    post: RouteMethod;
    propfind: RouteMethod;
    proppatch: RouteMethod;
    purge: RouteMethod;
    put: RouteMethod;
    rebind: RouteMethod;
    report: RouteMethod;
    search: RouteMethod;
    subscribe: RouteMethod;
    trace: RouteMethod;
    unbind: RouteMethod;
    unlink: RouteMethod;
    unlock: RouteMethod;
    unsubscribe: RouteMethod;
  }

  declare module.exports: KoaRoutes;
}
