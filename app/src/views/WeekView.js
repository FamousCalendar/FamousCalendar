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
    this.days = [];

    _createDaysOfWeek.call(this);
  }

  WeekView.prototype = Object.create(View.prototype);
  WeekView.prototype.constructor = WeekView;

  WeekView.DEFAULT_OPTIONS = {
    startDay: 0, // day of week, for first week of month
    startDate: 1, // day of month week starts on
    week: 1,
    daysInMonth: 30,
    year: 2014,
    month: 0,
    scrollView: null
  };

  function _createDaysOfWeek() {
    var fontColor;
    var day;
    var dayModifier;
    var modifier;
    var grid = new GridLayout({
      dimensions: [7, 1]
    });

    grid.sequenceFrom(this.days);

    for (var i = 0; i < 7; i++) {
      if (i < this.options.startDay || this.options.startDate + i > this.options.daysInMonth) {
        day = new DayBoxView({
          day: 0,
          scrollView: this.options.scrollView
        });
      } else {
        day = new DayBoxView({
          day: this.options.startDate - this.options.startDay + i,
          month: this.options.month,
          year: this.options.year,
          week: this.options.week,
          weekDay: i,
          scrollView: this.options.scrollView
        }); 
      }

      dayModifier = new Modifier({
        size: [undefined, undefined],
        transform: Transform.translate(0, 0, 0.1)
      });

      this.days.push(day);

      // passes click events up from DayBoxView to MonthView
      day.on('click', function(data) {
        this._eventOutput.emit('click', data);
      }.bind(this));
    }


    modifier = new Modifier({
      size: [undefined, undefined],
      transform: Transform.translate(0, 0, 0.1)
    });

    this.add(modifier).add(grid);
  }

  module.exports = WeekView;
});

