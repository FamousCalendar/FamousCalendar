define(function(require, exports, module) {
  // import dependencies
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var Transitionable = require('famous/transitions/Transitionable');
  var StateModifier     = require('famous/modifiers/StateModifier');
  var WeekView = require('views/WeekView');
  var Easing = require('famous/transitions/Easing');

  function MonthView() {
    View.apply(this, arguments);
    this.mods = [];

    _createMonthName.call(this);
    _createWeeks.call(this);
    _setListeners.call(this);
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

  function _createWeeks() {
    for (var i = 0; i < 5; i++) {
      var mod = new Modifier({
        transform: Transform.translate(0, (i+1) * 60, 0)
      })
      var slideMod = new StateModifier();
      var week = new WeekView({
        startDate: 1 + (i * 7),
        weekNumber: i + 1
      });
      this.mods.push(slideMod);
      this.add(slideMod).add(mod).add(week);
      this.subscribe(week);
    }
  }

  function _setListeners() {
    this._eventInput.on('click', function(data) {
      this.selectedRow = data.origin.properties.id;
      this._eventOutput.emit('dayView', data);
      _animateWeeks.call(this, -(this.selectedRow + 1) * 60, this.selectedRow);
    }.bind(this));
  }

  function _animateWeeks(amount, row) {
    var bottomMovement = (amount === 0) ? 0 : 400;
    var bottomDuration = (amount === 0) ? 500 : 1000;

    for (var i = 0; i < this.mods.length; i++) {
      if (i <= row) {
        this.mods[i].setTransform(Transform.translate(0, amount, 0), {
          duration: 500,
          curve: Easing.outQuint
        });
      } else {
        this.mods[i].setTransform(Transform.translate(0, bottomMovement, 0), {
          duration: bottomDuration,
          curve: Easing.outQuint
        });
      }
    }
  }

  module.exports = MonthView;
});