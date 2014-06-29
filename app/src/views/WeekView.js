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
  var Utilities = require('utilities');

  function WeekView() {
    View.apply(this, arguments);
    this.selectedDay;
    this.dayArray;

    _createBackgroundLayer.call(this);
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
    this.dayArray = undefined;
    this.surface.setContent(this.generateWeekHTML());
    this.backgroundSurface.setContent(this.generateBackgroundHTML());
  }

  WeekView.prototype.generateDayArray = function() {
    this.dayArray = [];
    var dayOfWeek;
    var dayOfMonth;
    var isPreviousMonth;
    var isNextMonth;

    for (dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      dayOfMonth = this.options.startDate + (dayOfWeek - this.options.startDay);
      isPreviousMonth = dayOfWeek < this.options.startDay;
      isNextMonth = dayOfMonth > this.options.daysInMonth;
      if (isPreviousMonth || isNextMonth) {
        this.dayArray.push('');
      } else {
        this.dayArray.push(dayOfMonth);
      }
    }
  }

  WeekView.prototype.generateBackgroundHTML = function() {
    this.dayArray || this.generateDayArray();
    var html = '<table><tr>';
    for (var i = 0; i < this.dayArray.length; i++) {
      var month = this.options.month + 1 < 10 ? '0' + (this.options.month + 1) : this.options.month + 1;
      var day = this.dayArray[i] < 10 ? '0' + this.dayArray[i] : this.dayArray[i];
      var dateString = [this.options.year, month, day].join('-');
      if (this.dayArray[i] && Utilities.getEvents(dateString).length) { // call function to determine if events exist on this day here
        html += '<td class="day event">.</td>';
      } else {
        html += '<td class="space"></td>';
      }
    }

    return html + '</tr></table>';
  };

  WeekView.prototype.generateWeekHTML = function() {
    this.dayArray || this.generateDayArray();
    var html = '<table><tr>';
    for (var i = 0; i < this.dayArray.length; i++) {
      html += '<td>' + this.dayArray[i] + '</td>';
    }

    return html + '</tr></table>';
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

  function _createBackgroundLayer() {
    this.backgroundSurface = new Surface({
      size: [undefined, undefined],
      content: this.generateBackgroundHTML(),
      properties: {
        color: 'grey',
        backgroundColor: 'white',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        zIndex: 0
      }
    });

    this.backgroundModifier = new Modifier({
      transform: Transform.translate(0, 0, 0)
    });

    this.add(this.backgroundModifier).add(this.backgroundSurface);
  }

  function _createDaysOfWeek() {
    var day;
    
    this.surface = new Surface({
      size: [undefined, undefined],
      content: this.generateWeekHTML(),
      properties: {
        fontFamily: 'sans-serif',
        zIndex: 1
      }
    });

    this.modifier = new Modifier({
      size: [undefined, undefined],
      transform: Transform.translate(0, 0, 1)
    });

    this.surface.on('click', function(data) {
      var day = this.determineClickedDay(data.x);

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
