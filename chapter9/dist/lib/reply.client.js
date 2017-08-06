"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (application) {
  var reply = function reply() {};
  reply.redirect = function (url) {
    application.navigate(url);
    return this;
  };

  reply.temporary = function () {
    return this;
  };

  reply.rewritable = function () {
    return this;
  };

  reply.permanent = function () {
    return this;
  };

  return reply;
};