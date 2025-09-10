import BasePlugin from './base-plugin.js';

const DEFAULT_MAX_MESSAGES = 100;

export default class WebBasePlugin extends BasePlugin {
  constructor(server, options, connectors) {
    super(server, options, connectors);

    // maximum number of messages to retain in memory
    this.maxMessages = options?.maxMessages || DEFAULT_MAX_MESSAGES;
    this.messages = [];
  }

  /**
   * Add a message to the internal buffer.
   * Only the last `maxMessages` messages are kept in memory.
   * When the buffer exceeds the cap, the oldest message is discarded.
   *
   * @param {*} message - message payload to store
   */
  addMessage(message) {
    if (this.messages.length >= this.maxMessages) {
      this.messages.shift();
    }
    this.messages.push(message);
  }

  /**
   * Return a copy of the buffered messages
   * @returns {Array} array containing buffered messages
   */
  getMessages() {
    return [...this.messages];
  }
}
