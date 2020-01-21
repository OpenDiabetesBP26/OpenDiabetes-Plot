"use strict";

exports.__esModule = true;
exports.default = void 0;
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/* eslint hammerhead/proto-methods: 2 */
var _default = {
  requestMarker: 'x-hammerhead|xhr|request-marker',
  withCredentials: 'x-hammerhead|xhr|with-credentials',
  origin: 'x-hammerhead|xhr|origin',
  fetchRequestCredentials: 'x-hammerhead|fetch|request-credentials'
};
exports.default = _default;
module.exports = exports.default;