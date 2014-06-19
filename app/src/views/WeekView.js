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
    startDay: 1,
    weekNumber: 1,
    daysInMonth: 30,
    year: 2014,
    month: 'January'
  };

    function _createDaysOfWeek() {
    var fontColor;
    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var grid = new GridLayout({
      dimensions: [7, 1]
    });

    grid.sequenceFrom(this.days);

    for (var i = 0; i < 7; i++) {
      if (this.options.startDate + i > this.options.daysInMonth) break;
      fontColor = (i === 0 || i === 6) ? 'grey' : 'black';
      
      var day = new DayBoxView({
        number: this.options.startDate + i,
        fontColor: fontColor,
        id: dayNames[i] + '-' + this.options.month + '-' + (this.options.startDate + i) + '-' + this.options.year + '-' + this.options.weekNumber
      });

      this.days.push(day);
      day.on('click', function(data) {
        this._eventOutput.emit('click', data);
      }.bind(this));
    }


    var modifier = new Modifier({
      size: [undefined, 70],
      transform: Transform.translate(0, 0, 0.1)
    });

    this.add(modifier).add(grid);
  }

  module.exports = WeekView;
});