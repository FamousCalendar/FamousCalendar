define(function(require, exports, module) {
  // import dependencies
  var View               = require('famous/core/View');
  var Surface            = require('famous/core/Surface');
  var Modifier           = require('famous/core/Modifier');
  var Transform          = require('famous/core/Transform');
  var RenderNode         = require('famous/core/RenderNode');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var GridLayout         = require("famous/views/GridLayout");
  var Transitionable     = require('famous/transitions/Transitionable');
  var ImageSurface       = require('famous/surfaces/ImageSurface');
  var DayBoxView         = require('views/DayBoxView');
  var Utilities          = require('utilities');
  var DateConstants      = require('config/DateConstants');

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

    this.backgroundModifier = new Modifier();
    this.add(this.backgroundModifier).add(this.backgroundSurface);
  }

  function _createDaysOfWeek() {
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

    this.surface.on('click', function(clickData) {
      var day = this.determineClickedDay(clickData.x);

      // nothing should happen if the user clicks on an already selected day
      // or on empty areas of partial weeks at the beginning and end of months
      if (day == null || this.selectedDay === day) return;

      this.selectedDay = day;
      this.options.scrollView.selectedWeek = this;
      this.options.scrollView.selectedMonth = this.options.month;
      this._eventOutput.emit('dateSelected', this);
    }.bind(this));

    this.surface.pipe(this.options.scrollView);
    this.add(this.modifier).add(this.surface);
  }

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

  WeekView.prototype.getDate = function() {
    return { 
      day: this.selectedDay, 
      month: this.options.month,
      year: this.options.year,
      week: this.options.week,
      weekDay: this.options.weekDay
    };
  };

  WeekView.prototype.refreshBackground = function() {
    this.backgroundSurface.setContent(this.generateBackgroundHTML());
  };

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
  };

  WeekView.prototype.generateBackgroundHTML = function() {
    this.dayArray || this.generateDayArray();
    var dateString;
    var html = '<table><tr>';

    for (var i = 0; i < this.dayArray.length; i++) {
      if (this.dayArray[i]) {
        dateString = DateConstants.generateDateString(this.options.year, this.options.month + 1, this.dayArray[i]);
        if (Utilities.hasEvents(dateString)) {
          html += '<td class="day event">.</td>';
        } else {
          html += '<td class="day event"></td>';
        }
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
    if (!(typeof x === 'number')) throw 'Argument must be a number!';
    var dayOfWeek = Math.floor(x / (window.innerWidth / 7));
    if (dayOfWeek < this.options.startDay || this.options.startDate + dayOfWeek > this.options.daysInMonth) return null;
    this.options.weekDay = dayOfWeek;

    return this.options.startDate + (dayOfWeek - this.options.startDay);
  };

  module.exports = WeekView;
});
