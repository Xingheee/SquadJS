import express from 'express';

import BasePlugin from './base-plugin.js';

export default class WebBasePlugin extends BasePlugin {
  static get description() {
    return (
      'Provides a basic web server for SquadJS. ' +
      'Requests to <code>/config</code> must include a shared secret via the ' +
      '<code>X-Config-Secret</code> header or provide a cookie whose name is ' +
      'defined by <code>sessionCookieName</code> containing the same secret. '
    );
  }

  static get defaultEnabled() {
    return false;
  }

  static get optionsSpecification() {
    return {
      port: {
        required: true,
        description: 'Port for the web server.',
        default: '',
        example: '8080'
      },
      configAuthSecret: {
        required: true,
        description: 'Shared secret required to access /config.',
        default: '',
        example: 'changeMe'
      },
      sessionCookieName: {
        required: false,
        description: 'Cookie name checked for the shared secret.',
        default: 'session'
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.app = express();

    // Middleware to protect /config endpoint
    this.app.use('/config', (req, res, next) => {
      const cookies = this._parseCookies(req.headers.cookie);
      const cookieSecret = cookies[this.options.sessionCookieName];
      const headerSecret = req.get('x-config-secret');

      if (
        headerSecret === this.options.configAuthSecret ||
        cookieSecret === this.options.configAuthSecret
      ) {
        return next();
      }

      res.status(401).send('Unauthorized');
    });

    this.httpServer = null;
  }

  _parseCookies(header = '') {
    return header.split(';').reduce((acc, cookie) => {
      const [name, ...rest] = cookie.split('=');
      if (!name) return acc;
      acc[name.trim()] = decodeURIComponent(rest.join('='));
      return acc;
    }, {});
  }

  async mount() {
    this.httpServer = this.app.listen(this.options.port);
  }

  async unmount() {
    if (this.httpServer) this.httpServer.close();
  }
}

