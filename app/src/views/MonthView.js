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
    this.mods = []; // modifiers
    this.weeks = []; // weekViews
    this.gridWeeks = []; // renderNodes (-> modifier -> weekView)

    _createLayout.call(this);
    _createMonthName.call(this);
    _createWeeks.call(this);
    _setListeners.call(this);
  }

  MonthView.DEFAULT_OPTIONS = {
    month: 0,
    year: 2014,
    scrollView: null,
    highlightModifier: null
  };

  function _createLayout() {
    var grid = new GridLayout({
      dimensions: [1, 7]
    });

    grid.sequenceFrom(this.gridWeeks);
    this.monthGridModifier = new Modifier();
    this.add(this.monthGridModifier).add(grid);
  }

  function _createMonthName() {
    this.monthNameView = new View();
    var node = new RenderNode();
    var backgroundSurface = new Surface({
      size: [undefined, undefined],
      properties: {
        backgroundColor: 'white',
        zIndex: 0.1
      }
    });

    var monthName = new Surface({
      size: [true, true],
      content: '&nbsp;' + DateConstants.monthNames[this.options.month].substr(0, 3).toUpperCase(),
      properties: {
        fontFamily: 'sans-serif',
        color: 'red',
        zIndex: 0
      }
    });

    var slideMod = new Modifier({
      transform: Transform.translate(0, 0, 1)
    });

    this.monthNameMod = new Modifier({
      align: [0, 0.9],
      origin: [0, 1],
      transform: Transform.translate(this.firstDay * (window.innerWidth / 7), 0, 1)
    });

    this.mods.push(slideMod);
    this.gridWeeks.push(node);
    this.weeks.push(monthName);

    this.monthNameView.add(backgroundSurface);
    this.monthNameView.add(this.monthNameMod).add(monthName);
    node.add(slideMod).add(this.monthNameView);
    
    backgroundSurface.pipe(this.options.scrollView);
    monthName.pipe(this.options.scrollView);
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
        week: i + 1,
        scrollView: this.options.scrollView
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
    this._eventInput.on('dateSelected', function(weekView) {
      this._eventOutput.emit('dateSelected', weekView);
    }.bind(this));

    this._eventInput.on('click', function(data) {
      var offset = this.options.scrollView.determineOffset();

      // if day of the month is 0 then surface is a spacer and should do nothing
      if (data.data.getDate().day === 0) return;


      if (this.selectedDay) {
        // do nothing if selected day is the same as the previously selected day
        if (this.selectedDay === data.data.getDate()) return;

        // transition between selected days
        data.difference = this.weekDay - data.data.getDate().weekDay;
        this.selectedDay = data.data.getDate();
        this.selectedRow = data.data.getDate().week;
        this._eventOutput.emit('changeDate', data.data);
      } else {
        // set the selected day and fire the transition into the dayView
        this.selectedDay = data.data.getDate();
        this.selectedRow = data.data.getDate().week;
        this._eventOutput.emit('dayView', data);
        _animateWeeks.call(this, (-(this.selectedRow) * ((window.innerHeight - 60)/7)) - (window.innerHeight/60) + offset, this.selectedRow);
      }
    }.bind(this));

    this._eventInput.on('back', function(data) {
      // only continue if this month is the selected month
      // if (this.options.month !== data.month) return;
      this.selectedDay = undefined;
      this.selectedRow = undefined;
      this._eventOutput.emit('monthView', data.data);
      _animateWeeks.call(this, 0, this.selectedRow);
    }.bind(this));
  }

  MonthView.prototype = Object.create(View.prototype);
  MonthView.prototype.constructor = MonthView;

  MonthView.prototype.refreshEvents = function() {
    for (var i = 1; i < this.weeks.length; i++) {
      this.weeks[i].refreshBackground();
    }
  };

  MonthView.prototype.getMonth = function() {
    return { month: this.options.month, year: this.options.year };
  };

  MonthView.prototype.setMonth = function(month, year) {
    this.options.month = month;
    this.options.year = year;
    this.firstDay = new Date(this.options.year, this.options.month, 1).getDay();
    this.daysInMonth = new Date(this.options.year, this.options.month + 1, 0).getDate();

    // update month name
    this.weeks[0].setContent('&nbsp;' + DateConstants.monthNames[this.options.month].substr(0, 3).toUpperCase());
    this.monthNameMod.setTransform(Transform.translate(this.firstDay * (window.innerWidth / 7), 0, 1));

    // update weeks of month
    for (var i = 0; i < 6; i++) {
      this.weeks[i + 1].setWeek({
        startDay: i ? 0 : this.firstDay,
        startDate: i ? (7 - (this.firstDay) + ((i - 1) * 7)) + 1 : 1,
        daysInMonth: this.daysInMonth,
        month: this.options.month,
        year: this.options.year,
      });
    }
  };

  module.exports = MonthView;
});