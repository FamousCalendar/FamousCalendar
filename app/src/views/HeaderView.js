define(function(require, exports, module) {
  // import dependencies
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var Transitionable = require('famous/transitions/Transitionable');
  var Easing = require('famous/transitions/Easing');
  var ImageSurface = require('famous/surfaces/ImageSurface');

  function HeaderView() {
    View.apply(this, arguments);

    _createBackground.call(this);
    _createBackButton.call(this);
    _createAddEventButton.call(this);
    _createDaysOfWeekBar.call(this);
    _setListeners.call(this);
  }

  HeaderView.DEFAULT_OPTIONS = {
    appView: null
  };

  function _createBackground() {
    var backgroundSurface = new Surface({
      properties: {
        backgroundColor: '#FAFAFA',
        borderBottom: '1px solid lightgrey',
        zIndex: 3
      }
    });

    this.backgroundModifier = new Modifier({
      transform: Transform.translate(0, 0, 3)
    });

    this.add(this.backgroundModifier).add(backgroundSurface);
  }

  function _createBackButton() {
    this.backButton = new View();
    this.backButtonModifier = new Modifier();

    this.titleSurface = new Surface({
      size: [true, undefined],
      content: '2014',
      properties: {
        lineHeight: '50px',
        fontFamily: 'sans-serif',
        fontSize: '16px',
        textAlign: 'left',
        color: 'red',
        zIndex: 3,
      }
    });

    this.titleModifier = new Modifier({
      transform: Transform.translate(28, 0, 3)
    });

    var backIcon = new ImageSurface({
      size: [30, 30],
      content:'content/images/back_arrow.png',
      properties: {
        pointerEvents: 'none',
        zIndex: 3
      }
    });

    var backIconModifier = new Modifier({
      align: [0.045, 0.4],
      origin: [0.5, 0.5],
      transform: Transform.translate(0, 0, 3)
    });

    this.backButton.add(backIconModifier).add(backIcon);
    this.backButton.add(this.titleModifier).add(this.titleSurface);
    this.add(this.backButtonModifier).add(this.backButton);
  }

  function _createAddEventButton() {
    this.plusIcon = new ImageSurface({
      size: [18, 18],
      content:'content/images/plus_icon.png',
      properties: {
        zIndex: 3
      }
    });

    var plusIconModifier = new Modifier({
      align: [0.925, 0.4],
      origin: [0.5, 0.5],
      transform: Transform.translate(0, 0, 3)
    });

    this.add(plusIconModifier).add(this.plusIcon);
  }

  function _createDaysOfWeekBar() {
    var html = '<table><tr><td>S</td><td>M</td><td>T</td><td>W</td>' +
               '<td>T</td><td>F</td><td>S</td></tr></table>';

    var daysSurface = new Surface({
      size: [undefined, 14],
      content: html,
      properties: {
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontSize: '10px',
        zIndex: 5
      }
    });

    this.daysModifier = new Modifier({
      size: [undefined, 14],
      transform: Transform.translate(0, 44, 5)
    });

    this.add(this.daysModifier).add(daysSurface);
  }

  function _setListeners() {
    this.titleSurface.on('click', function(clickData) {
      if (this.options.appView.state === 'monthView') return;
      this._eventOutput.emit('stateChangeMonthView', clickData);
    }.bind(this));

    this.plusIcon.on('click', function(clickData) {
      this._eventOutput.emit('addEventView', clickData);
    }.bind(this));
  }

  HeaderView.prototype = Object.create(View.prototype);
  HeaderView.prototype.constructor = HeaderView;

  module.exports = HeaderView;
});