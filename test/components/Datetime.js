'use strict';

var tape = require('tape');
var t = require('tcomb-validation');
var bootstrap = require('../../lib/templates/bootstrap');
var Datetime = require('../../lib/components').Datetime;
var React = require('react');
var vdom = require('react-vdom');
var util = require('./util');
var ctx = util.ctx;
var ctxPlaceholders = util.ctxPlaceholders;
var renderComponent = util.getRenderComponent(Datetime);

var transformer = {
  format: function (value) {
    return t.Dat.is(value) ? value.toISOString() : null;
  },
  parse: function (value) {
    return new Date(value);
  }
};

tape('Datetime', function (tape) {

  tape.test('label', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'Default label',
      'should have a default label');

    tape.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {label: 'mylabel'},
        ctx: ctx
      }).getLocals().label,
      'mylabel',
      'should handle label option as string');

    tape.deepEqual(
      vdom(new Datetime({
        type: t.Dat,
        options: {label: React.DOM.i(null, 'JSX label')},
        ctx: ctx
      }).getLocals().label),
      {tag: 'i', children: 'JSX label'},
      'should handle label option as JSX');

  });

  tape.test('help', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {help: 'myhelp'},
        ctx: ctx
      }).getLocals().help,
      'myhelp',
      'should handle help option as string');

    tape.deepEqual(
      vdom(new Datetime({
        type: t.Dat,
        options: {help: React.DOM.i(null, 'JSX help')},
        ctx: ctx
      }).getLocals().help),
      {tag: 'i', children: 'JSX help'},
      'should handle help option as JSX');

  });

  tape.test('value', function (tape) {
    tape.plan(2);

    tape.deepEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx
      }).getLocals().value,
      [null, null, null],
      'default value should be [null, null, null]');

    tape.deepEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx,
        value: new Date(1973, 10, 30)
      }).getLocals().value,
      ['1973', '10', '30'],
      'should handle value option');

  });

  tape.test('hasError', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx
      }).getLocals().hasError,
      false,
      'default hasError should be false');

    tape.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {hasError: true},
        ctx: ctx
      }).getLocals().hasError,
      true,
      'should handle hasError option');

  });

  tape.test('error', function (tape) {
    tape.plan(3);

    tape.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx
      }).getLocals().error,
      undefined,
      'default error should be undefined');

    tape.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {error: 'myerror'},
        ctx: ctx
      }).getLocals().error,
      'myerror',
      'should handle error option');

    tape.deepEqual(
      new Datetime({
        type: t.Dat,
        options: {error: function (value) { return 'error: ' + value; }},
        ctx: ctx,
        value: new Date(1973, 10, 30)
      }).getLocals().error,
      'error: 1973,10,30',
      'should handle error option as a function');
  });

  tape.test('template', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {},
        ctx: ctx
      }).getTemplate(),
      bootstrap.date,
      'default template should be bootstrap.date');

    var template = function () {};

    tape.strictEqual(
      new Datetime({
        type: t.Dat,
        options: {template: template},
        ctx: ctx
      }).getTemplate(),
      template,
      'should handle template option');

  });

  if (typeof window !== 'undefined') {

    tape.test('validate', function (tape) {
      tape.plan(4);

      var result;

      // required type, default value
      result = renderComponent({
        type: t.Dat
      }).validate();

      tape.strictEqual(result.isValid(), false);
      tape.deepEqual(result.value, null);

      // required type, setting a value
      result = renderComponent({
        type: t.Dat,
        value: new Date(1973, 10, 30)
      }).validate();

      tape.strictEqual(result.isValid(), true);
      tape.strictEqual(result.value.getFullYear(), 1973);

    });

  }

});

