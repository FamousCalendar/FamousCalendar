define(function(require, exports, module) {
  // import dependencies
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');

  function AppView() {
    View.apply(this, arguments);

    this.add(new Surface({
      content: 'Hello World'
    }));
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
  };

  module.exports = AppView;
});