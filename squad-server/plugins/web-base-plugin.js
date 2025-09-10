import BasePlugin from './base-plugin.js';

import { COPYRIGHT_MESSAGE } from '../utils/constants.js';

export default class WebBasePlugin extends BasePlugin {
  static get optionsSpecification() {
    return {};
  }

  async prepareToMount() {}

  async sendWebMessage(message) {
    if (typeof message === 'object' && 'embed' in message) {
      message.embed.footer = message.embed.footer || { text: COPYRIGHT_MESSAGE };
    }
    this.server.emit('WEB_MESSAGE', message);
  }
}
