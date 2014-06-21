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
  var GridLayout = require('famous/views/GridLayout');
  var RenderNode = require('famous/core/RenderNode');

  function MonthView() {
    View.apply(this, arguments);
    this.mods = [];
    this.weeks = [];
    this.gridWeeks = [];

    _createLayout.call(this);
    _createMonthName.call(this);
    _createWeeks.call(this);
    _setListeners.call(this);
  }

  MonthView.prototype = Object.create(View.prototype);
  MonthView.prototype.constructor = MonthView;

  MonthView.DEFAULT_OPTIONS = {
    height: 70,
    monthNameShort: 'JAN',
    monthName: 'January',
    firstDayOfMonth: 0,
    daysInMonth: 30
  };

  function _createLayout() {
    var grid = new GridLayout({
      dimensions: [1, 6]
    });
    grid.sequenceFrom(this.gridWeeks);

    this.monthGridModifier = new Modifier({});

    this.add(this.monthGridModifier).add(grid);
  }

  function _createMonthName() {
    var monthName = new Surface({
      size: [undefined, undefined],
      content: '&nbsp;&nbsp;JUN',
      properties: {
        lineHeight: '100px',
        fontFamily: 'sans-serif',
        fontSize: '16px',
        color: 'red',
        backgroundColor: 'white',
      }
    });

    var slideMod = new Modifier({
      transform: Transform.translate(0, 0, 1)
    });

    var node = new RenderNode({});
    this.mods.push(slideMod);
    node.add(slideMod).add(monthName);
    this.gridWeeks.push(node);
    this.weeks.push(monthName);

    // this.add(slideMod).add(monthName);
  }

  function _createWeeks() {
    for (var i = 0; i < 6; i++) {
      // if (i === 0) {
      //   var week = new WeekView({});
      // }

      var mod = new Modifier({
        // transform: Transform.translate(0, (i+1) * 70, 0)
      });
      var slideMod = new Modifier();
      var week = new WeekView({
        startDate: 1 + (i * 7),
        weekNumber: i + 1,
        month: 'June',
        year: '2014'
      });

      var node = new RenderNode({});
      node.add(slideMod).add(week);
      this.gridWeeks.push(node);
      this.weeks.push(week);
      this.mods.push(slideMod);
      // this.add(slideMod).add(mod).add(week);
      this.subscribe(week);
    }
  }

  function _setListeners() {
    this._eventInput.on('click', function(data) {
      console.log(data.selectedDay);
      console.log(window.innerHeight);
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
        _animateWeeks.call(this, (-(this.selectedRow) * ((window.innerHeight - 60)/6)) - (window.innerHeight/60), this.selectedRow);
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
        fontSize: '',
        color: color,
        backgroundColor: '',
        borderRadius: '0px'
    });
    this.selectedDay = undefined;
  }

  function _animateWeeks(amount, row) {
    var bottomMovement = (amount === 0) ? 0 : 600;
    var bottomDuration = (amount === 0) ? 500 : 1000;
    var backgroundOpacity = (amount === 0) ? 0.999 : 0.001;

    for (var i = 0; i < this.mods.length; i++) {
      this.mods[i].halt();
      if (i === row) {
        console.log(this.weeks[i]);
        // fade out backgroundsurface/border of days in selected week so it doesn't show in header
        for (var j = 0; j < this.weeks[i].days.length; j++) {
          this.weeks[i].days[j].backgroundModifier.halt();
          this.weeks[i].days[j].backgroundModifier.setOpacity(backgroundOpacity, {duration: 100, curve: Easing.inQuint});
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