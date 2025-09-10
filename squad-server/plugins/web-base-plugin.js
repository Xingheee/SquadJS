import BasePlugin from './base-plugin.js';

/**
 * Base plugin for web-based integrations. Provides a helper to emit messages
 * to the SquadJS web layer. Messages are broadcast using the `WEB_MESSAGE`
 * event which can be handled by front-end consumers via the SocketIOAPI
 * plugin.
 */
export default class WebBasePlugin extends BasePlugin {
  static get description() {
    return 'Base class for web-based plugins.';
  }

  static get optionsSpecification() {
    return {};
  }

  async sendWebMessage(message) {
    this.server.emit('WEB_MESSAGE', message);
  }
}
