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

  function WeekView() {
    View.apply(this, arguments);

    _createDaysOfWeek.call(this);
  }

  WeekView.prototype = Object.create(View.prototype);
  WeekView.prototype.constructor = WeekView;

  WeekView.DEFAULT_OPTIONS = {
    startDay: 1,
    weekNumber: 1,
    daysInMonth: 30
  };

    function _createDaysOfWeek() {
    var fontColor;
    var grid = new GridLayout({
      dimensions: [7, 1]
    });

    var days = [];
    grid.sequenceFrom(days);

    for (var i = 0; i < 7; i++) {
      if (this.options.startDate + i > this.options.daysInMonth) break;
      fontColor = (i === 0 || i === 6) ? 'grey' : 'black';
      
      var day = new Surface({
        content: '<br>' + (this.options.startDate + i),
        properties: {
          textAlign: 'center',
          color: fontColor,
          fontSize: '14px',
          fontFamily: 'sans-serif',
          borderTop: '1px solid lightgrey',
          id: this.options.weekNumber
        }
      });

      days.push(day);
      day.on('click', function(data) {
        this._eventOutput.emit('click', data);
      }.bind(this));
    }


    var modifier = new Modifier({
      size: [undefined, 60],
      transform: Transform.translate(0, 0, 0.1)
    });

    this.add(modifier).add(grid);
  }

  module.exports = WeekView;
});