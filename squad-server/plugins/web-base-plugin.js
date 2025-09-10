import { createServer } from 'http';

import BasePlugin from './base-plugin.js';

export default class WebBasePlugin extends BasePlugin {
  static get optionsSpecification() {
    return {
      port: {
        required: false,
        description: 'The port for the web server.',
        default: 3000,
        example: '3000'
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.webServer = createServer();
  }

  async mount() {
    await new Promise((resolve) => this.webServer.listen(this.options.port, resolve));
  }

  async unmount() {
    await new Promise((resolve) => this.webServer.close(resolve));
  }
}
