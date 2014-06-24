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
  var DateConstants = require('config/DateConstants');

  function MonthView() {
    View.apply(this, arguments);
    this.firstDay = new Date(this.options.year, this.options.month, 1).getDay();
    this.daysInMonth = new Date(this.options.year, this.options.month + 1, 0).getDate();
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
    month: 0,
    year: 2014
  };

  function _createLayout() {
    var grid = new GridLayout({
      dimensions: [1, 7]
    });

    grid.sequenceFrom(this.gridWeeks);
    this.monthGridModifier = new Modifier({});
    this.add(this.monthGridModifier).add(grid);
  }

  function _createMonthName() {
    var monthName = new Surface({
      size: [undefined, undefined],
      content: '&nbsp;&nbsp;' + DateConstants.monthNames[this.options.month].substr(0, 3).toUpperCase(),
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

    var node = new RenderNode();
    this.mods.push(slideMod);
    node.add(slideMod).add(monthName);
    this.gridWeeks.push(node);
    this.weeks.push(monthName);

    // this.add(slideMod).add(monthName);
  }

  function _createWeeks() {
    var week;
    var weekModifier;
    var renderNode;

    for (var i = 0; i < 6; i++) {
      week = new WeekView({
        startDay: i ? 0 : this.firstDay,
        startDate: i ? (7 - (this.firstDay) + ((i - 1) * 7)) + 1 : 1,
        daysInMonth: this.daysInMonth,
        month: this.options.month,
        year: this.options.year,
        week: i + 1
      });

      weekModifier = new Modifier();
      renderNode = new RenderNode();

      renderNode.add(weekModifier).add(week);
      this.weeks.push(week);
      this.mods.push(weekModifier);
      this.gridWeeks.push(renderNode);
      this.subscribe(week);
    }
  }

  function _setListeners() {
    this._eventInput.on('click', function(data) {
      if (data.getDate().day === 0) return;

      if (this.selectedDay) {
        if (this.selectedDay === data) return;
        data.difference = this.selectedDay.getDate().weekDay - data.getDate().weekDay;
        _unselectDay.call(this);
        this.selectedDay = data;
        this.selectedRow = data.getDate().week;
        this._eventOutput.emit('changeDate', data);
      } else {
        this.selectedDay = data;
        this.selectedRow = data.getDate().week;
        this._eventOutput.emit('dayView', data);
        _animateWeeks.call(this, (-(this.selectedRow) * ((window.innerHeight - 60)/7)) - (window.innerHeight/60), this.selectedRow);
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
    var color = this.selectedDay.isWeekend() ? 'grey' : 'black';
    this.selectedDay.numberSurface.setProperties({
        fontWeight: '',
        fontSize: '',
        color: color,
        backgroundColor: '',
        borderRadius: '0px'
    });
    this.selectedDay = undefined;
  }

  function _animateWeeks(amount, row) {
    var bottomMovement = amount ? 600 : 0;
    var bottomDuration = amount ? 1000 : 500;
    var backgroundOpacity = amount ? 0.01 : 0.99;
    var zIndex = amount ? 4 : 0;

    for (var i = 0; i < this.mods.length; i++) {
      this.mods[i].halt();
      if (i === row) {
        // fade out backgroundsurface/border of days in selected week so it doesn't show in header
        for (var j = 0; j < this.weeks[i].days.length; j++) {
          this.weeks[i].days[j].backgroundModifier.halt();
          this.weeks[i].days[j].backgroundModifier.setOpacity(backgroundOpacity, {duration: 50, curve: Easing.inQuint});
        }
        this.mods[i].setTransform(Transform.translate(0, amount, zIndex), {
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