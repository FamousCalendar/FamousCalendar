define(function(require, exports, module) {
  // import dependencies
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var RenderNode = require('famous/core/RenderNode');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var GridLayout = require("famous/views/GridLayout");
  var Transitionable = require('famous/transitions/Transitionable');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var DayBoxView = require('views/DayBoxView');

  function WeekView() {
    View.apply(this, arguments);
    this.selectedDay;

    _createDaysOfWeek.call(this);
  }

  WeekView.DEFAULT_OPTIONS = {
    startDay: 0, // day of week, for first week of month
    startDate: 1, // day of month week starts on
    week: 1,
    daysInMonth: 30,
    year: 2014,
    month: 0,
    scrollView: null
  };

  WeekView.prototype = Object.create(View.prototype);
  WeekView.prototype.constructor = WeekView;

  WeekView.prototype.setWeek = function(options) {
    this.options.startDay = options.startDay;
    this.options.startDate = options.startDate;
    this.options.daysInMonth = options.daysInMonth;
    this.options.month = options.month;
    this.options.year = options.year;

    this.selectedDay = undefined;
    this.surface.setContent(this.generateWeekHTML());
  }

  WeekView.prototype.generateWeekHTML = function() {
    var arr = [];

    for (var i = 0; i < 7; i++) {
      if (i < this.options.startDay || this.options.startDate + (i - this.options.startDay) > this.options.daysInMonth) {
        arr.push('');
      } else {
        arr.push(this.options.startDate + (i - this.options.startDay));
      }
    }

    return '<table><tr><td style="color:grey">' + arr[0] + '</td><td>' + arr[1] + '</td><td>' + 
           arr[2] + '</td><td>' + arr[3] + '</td><td>' + arr[4] + '</td><td>' +
           arr[5] + '</td><td style="color:grey">' + arr[6] + '</td></tr></table>';
  };

  WeekView.prototype.determineClickedDay = function(x) {
    var dayOfWeek = Math.floor(x / (window.innerWidth / 7));
    if (dayOfWeek < this.options.startDay || this.options.startDate + dayOfWeek > this.options.daysInMonth) return null;
    this.options.weekDay = dayOfWeek;

    return this.options.startDate + (dayOfWeek - this.options.startDay);
  };

  WeekView.prototype.isWeekend = function() {
    return this.selectedDay === 0 || this.selectedDay === 6;
  };

  WeekView.prototype.getDate = function() {
    return { 
      day: this.selectedDay, 
      month: this.options.month,
      year: this.options.year,
      week: this.options.week,
      weekDay: this.options.weekDay
    };
  };

  function _createDaysOfWeek() {
    var day;
    
    this.surface = new Surface({
      size: [undefined, undefined],
      content: this.generateWeekHTML(),
      properties: {
        // backgroundColor: 'white',
        fontFamily: 'sans-serif',
        borderTop: '1px solid lightgrey',
        zIndex: 1
      }
    });

    this.modifier = new Modifier({
      size: [undefined, undefined],
      transform: Transform.translate(0, 0, 1)
    });

    this.surface.on('click', function(data) {
      var day = this.determineClickedDay(data.x);
      console.log(day);

      // check if user clicked on an actual day
      if (day == null) return;

      // check if user clicked on an already selected day
      if (this.selectedDay === day) return;

      if (this.selectedDay) {
        this._eventOutput.emit('dateChanged', this);
      }

      this.selectedDay = day;
      this.options.scrollView.selectedWeek = this;
      this.options.scrollView.selectedMonth = this.options.month;
      this._eventOutput.emit('dateSelected', this);
    }.bind(this));

    this.surface.pipe(this.options.scrollView);
    this.add(this.modifier).add(this.surface);
  }

  module.exports = WeekView;
});
