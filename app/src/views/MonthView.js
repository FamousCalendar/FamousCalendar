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
    this.weeks = [];

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
        fontSize: '16px',
        color: 'red',
        pointerEvents: 'none'
      }
    });

    var slideMod = new Modifier();
    this.mods.push(slideMod);

    this.add(slideMod).add(monthName);
  }

  function _createWeeks() {
    for (var i = 0; i < 5; i++) {
      var mod = new Modifier({
        transform: Transform.translate(0, (i+1) * 70, 0)
      })
      var slideMod = new Modifier();
      var week = new WeekView({
        startDate: 1 + (i * 7),
        weekNumber: i + 1,
        month: 'June',
        year: '2014'
      });

      this.weeks.push(week);
      this.mods.push(slideMod);
      this.add(slideMod).add(mod).add(week);
      this.subscribe(week);
    }
  }

  function _setListeners() {
    this._eventInput.on('click', function(data) {
      if (this.selectedDay) {
        if (this.selectedDay.id === data.selectedDay.id) return;
        data.difference = this.selectedDay.id - data.selectedDay.id;
        _unselectDay.call(this);
        this.selectedDay = data.selectedDay;
        this.selectedRow = Number(data.origin.properties.id.split('-').pop());
        this._eventOutput.emit('changeDate', data);
      } else {
        this.selectedDay = data.selectedDay;
        this.selectedRow = Number(data.origin.properties.id.split('-').pop());
        this._eventOutput.emit('dayView', data);
        _animateWeeks.call(this, (-(this.selectedRow + 1) * 70) + 18, this.selectedRow);
      }
    }.bind(this));

    this._eventInput.on('back', function(data) {
      _unselectDay.call(this);
      this._eventOutput.emit('monthView', data);
      _animateWeeks.call(this, 0, this.selectedRow);
    }.bind(this));
  }

  function _unselectDay() {
    // saturday and sunday should be grey
    var color = this.selectedDay.properties.id[0] === 'S' ? 'grey' : 'black';
    this.selectedDay.setProperties({
        fontWeight: '',
        fontSize: '18px',
        color: color,
        backgroundColor: '',
        borderRadius: '0px'
    });
    this.selectedDay = undefined;
  }

  function _animateWeeks(amount, row) {
    var bottomMovement = (amount === 0) ? 0 : 400;
    var bottomDuration = (amount === 0) ? 500 : 1000;
    var backgroundOpacity = (amount === 0) ? 0.999 : 0.001;

    for (var i = 0; i < this.mods.length; i++) {
      if (i === row) {
        // fade out backgroundsurface/border of days in selected week so it doesn't show in header
        for (var j = 0; j < this.weeks[i - 1].days.length; j++) {
          this.weeks[i - 1].days[j].backgroundModifier.setOpacity(backgroundOpacity, {duration: 100, curve: Easing.inQuint});
        }
        this.mods[i].setTransform(Transform.translate(0, amount, 4), {
          duration: 500,
          curve: Easing.outQuart
        });
      } else if (i < row) {
        this.mods[i].setTransform(Transform.translate(0, amount, 0), {
          duration: 500,
          curve: Easing.outQuart
        });
      } else {
        this.mods[i].setTransform(Transform.translate(0, bottomMovement, 0), {
          duration: bottomDuration,
          curve: Easing.outCubic
        });
      }
    }
  }

  module.exports = MonthView;
});