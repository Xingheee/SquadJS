import { createServer } from 'http';

import BasePlugin from './base-plugin.js';

export default class WebBasePlugin extends BasePlugin {
  static get optionsSpecification() {
    return {
      port: {
        required: false,
        description: 'Port to bind the web server to.',
        default: 3000,
        example: '3000'
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.server = createServer();
  }

  async mount() {
    this.server.listen(this.options.port);
  }

  async unmount() {
    this.server.close();
  }
}
