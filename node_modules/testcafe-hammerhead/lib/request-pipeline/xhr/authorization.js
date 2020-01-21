"use strict";

exports.__esModule = true;
exports.default = void 0;
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/* eslint hammerhead/proto-methods: 2 */
var _default = {
  valuePrefix: 'hammerhead|prefix|by-client',
  headers: ['authorization', 'authentication-info', 'proxy-authenticate', 'proxy-authorization']
};
exports.default = _default;
module.exports = exports.default;