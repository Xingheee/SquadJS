import { createServer } from 'http';
import BasePlugin from './base-plugin.js';

/**
 * Base class for plugins exposing a HTTP interface. It provides
 * an authentication middleware that verifies a shared secret
 * before any request to the `/config` endpoint is handled.
 */
export default class WebBasePlugin extends BasePlugin {
  static get description() {
    return (
      'The <code>WebBasePlugin</code> provides a minimal HTTP server for plugins that need to expose a web interface. ' +
      'Requests to <code>/config</code> are protected by a token or session cookie to prevent unauthorised access.'
    );
  }

  static get defaultEnabled() {
    return false;
  }

  static get optionsSpecification() {
    return {
      webPort: {
        required: true,
        description: 'Port for the internal HTTP server.',
        default: 3001,
        example: '3001'
      },
      authToken: {
        required: true,
        description:
          'Shared secret used to authorise /config requests. The token may be supplied via the Authorization header, a `token` query parameter or a cookie.',
        default: '',
        example: 'ChangeMe'
      },
      authCookieName: {
        required: false,
        description: 'Cookie name checked for the auth token.',
        default: 'session',
        example: 'session'
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);
    this.httpServer = createServer(this._handleRequest.bind(this));
  }

  async mount() {
    this.httpServer.listen(this.options.webPort);
  }

  async unmount() {
    this.httpServer.close();
  }

  /**
   * Simple authentication middleware for /config requests.
   * Returns true when the request is authorised.
   */
  _authenticate(req) {
    const token = this.options.authToken;
    if (!token) return true;

    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.searchParams.get('token') === token) return true;

    const header = req.headers.authorization || req.headers['x-auth-token'];
    if (header) {
      const parts = header.split(' ');
      if (parts[parts.length - 1] === token) return true;
    }

    if (req.headers.cookie) {
      const cookies = Object.fromEntries(
        req.headers.cookie.split(';').map((c) => c.trim().split('='))
      );
      if (cookies[this.options.authCookieName] === token) return true;
    }

    return false;
  }

  _handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.startsWith('/config')) {
      if (!this._authenticate(req)) {
        res.writeHead(401);
        res.end('Unauthorized');
        return;
      }
      this.onConfigRequest(req, res, url);
      return;
    }

    this.routeRequest(req, res, url);
  }

  // Methods intended to be overridden by subclasses
  onConfigRequest(req, res) {
    res.writeHead(404);
    res.end();
  }

  routeRequest(req, res) {
    res.writeHead(404);
    res.end();
  }
}
