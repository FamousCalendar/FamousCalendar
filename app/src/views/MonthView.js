define(function(require, exports, module) {
  // import dependencies
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var Transitionable = require('famous/transitions/Transitionable');
  var StateModifier     = require('famous/modifiers/StateModifier');

  function MonthView() {
    View.apply(this, arguments);
    this.mods = [];

    _createMonthName.call(this);
  }

  MonthView.prototype = Object.create(View.prototype);
  MonthView.prototype.constructor = MonthView;

  MonthView.DEFAULT_OPTIONS = {
  };

  function _createMonthName() {
    var monthName = new Surface({
      size: [undefined, 60],
      content: '&nbsp;&nbsp;JUN',
      properties: {
        lineHeight: '80px',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: 'red',
        pointerEvents: 'none'
      }
    });

    var slideMod = new StateModifier();
    this.mods.push(slideMod);

    this.add(slideMod).add(monthName);
  }

  module.exports = MonthView;
});