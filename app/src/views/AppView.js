define(function(require, exports, module) {
  // import dependencies
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  
  var DayView = require('views/DayView');

  function AppView() {
    View.apply(this, arguments);

    this.add(new DayView());
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
  };

  module.exports = AppView;
});