define(function(require, exports, module) {
  // import dependencies
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var Transitionable = require('famous/transitions/Transitionable');

  function AppView() {
    View.apply(this, arguments);

    _createLayout.call(this);
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
  };

  function _createLayout() {
    this.layout = new HeaderFooterLayout({
      headerSize: 60
    });

    this.headerModifier = new Modifier({});

    var header = new Surface({
      size: [undefined, undefined],
      properties: {
        backgroundColor: '#F2F2F2'
      }
    });

    this.layout.header.add(this.headerModifier).add(header);
    this.add(this.layout);
  }

  module.exports = AppView;
});