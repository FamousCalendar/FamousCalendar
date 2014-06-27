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

  function DayBoxView() {
    View.apply(this, arguments);

    _createBackground.call(this);
    _createNumberSurface.call(this);
  }

  DayBoxView.prototype = Object.create(View.prototype);
  DayBoxView.prototype.constructor = DayBoxView;

  DayBoxView.prototype.isWeekend = function() {
    return this.options.weekDay === 0 || this.options.weekDay === 6;
  };

  DayBoxView.prototype.setDate = function(year, month, day, week) {
    this.numberSurface.setContent(day);
    // need to check if an event exists for this date here
    this.options.day = day;
    this.options.month = month;
    this.options.year = year;
    this.options.week = week;
    return true;
  };

  DayBoxView.prototype.getDate = function() {
    return { 
      day: this.options.day, 
      month: this.options.month,
      year: this.options.year,
      week: this.options.week,
      weekDay: this.options.weekDay
    };
  };

  DayBoxView.DEFAULT_OPTIONS = {
    day: 1,
    dayName: 'Sunday',
    week: 1,
    weekDay: 0,
    month: 1,
    year: 2014,
    weekdayColor: 'black',
    weekendColor: 'grey',
    backgroundColor: 'white',
    borderColor: 'lightgrey',
    selectedColor: 'black',
    font: 'sans-serif',
    scrollView: null
  };

  function _createBackground() {
    var borderColor = this.options.day ? this.options.borderColor : this.options.backgroundColor;

    this.backgroundSurface = new Surface({
      size: [undefined, undefined],
      properties: {
        borderTop: '1px solid ' + borderColor,
        backgroundColor: this.options.backgroundColor,
        zIndex: 1
      }
    });

    this.backgroundModifier = new Modifier();

    // source for click event on content portion of app layout
    this.backgroundSurface.on('click', function(data) {
      // highlight selected day
      this.numberSurface.setProperties({
        color: 'white',
        fontWeight: 'bold',
        fontSize: '18px',
        backgroundColor: this.options.selectedColor,
        borderRadius: '50px'
      });

      // passes along the DayBoxView (has all date information) along with the click data
      this._eventOutput.emit('click', { data: this, click: data });
    }.bind(this));

    this.backgroundSurface.pipe(this.options.scrollView);
    this.add(this.backgroundModifier).add(this.backgroundSurface);
  }

  function _createNumberSurface() {
    this.numberSurface = new Surface({
      size: [34, true],
      content: this.options.day || '',
      properties: {
        lineHeight: '34px',
        textAlign: 'center',
        color: this.isWeekend() ? this.options.weekendColor : this.options.weekdayColor,
        fontFamily: this.options.font,
        pointerEvents: 'none',
        zIndex: 1
      }
    });

    this.numberModifier = new Modifier({
      align: [0.5, 0.33],
      origin: [0.5, 0.5],
    });

    this.add(this.numberModifier).add(this.numberSurface);
  }

  module.exports = DayBoxView;
});