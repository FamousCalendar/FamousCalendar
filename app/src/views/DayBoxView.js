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

  DayBoxView.DEFAULT_OPTIONS = {
    number: 1,
    fontColor: 'black',
    // dayName-month-day-year-weekofmonth
    id: 'Wednesday-January-1-2014-1'
  };

  function _createBackground() {
    this.backgroundSurface = new Surface({
      size: [undefined, undefined],
      properties: {
        borderTop: '1px solid lightgrey',
        id: this.options.id
      }
    });

    this.backgroundModifier = new Modifier({});

    this.backgroundSurface.on('click', function(data) {
      this.numberSurface.setProperties({
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'black',
        borderRadius: '99999px'
      });

      data.selectedDay = this.numberSurface;
      this._eventOutput.emit('click', data);
    }.bind(this));

    this.add(this.backgroundModifier).add(this.backgroundSurface);
  }

  function _createNumberSurface() {
    this.numberSurface = new Surface({
      size: [26, 26],
      content: this.options.number,
      properties: {
        lineHeight: '24px',
        textAlign: 'center',
        color: this.options.fontColor,
        fontSize: '14px',
        fontFamily: 'sans-serif',
        pointerEvents: 'none',
        id: this.options.id
      }
    });

    this.numberModifier = new Modifier({
      align: [0.5, 0.30],
      origin: [0.5, 0.5],
    });

    this.add(this.numberModifier).add(this.numberSurface);
  }

  module.exports = DayBoxView;
});