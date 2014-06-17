define(function(require, exports, module) {
  // import dependencies
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var GridLayout = require("famous/views/GridLayout");
  var Transitionable = require('famous/transitions/Transitionable');

  function AppView() {
    View.apply(this, arguments);

    _createLayout.call(this);
    _createDaysOfWeekBar.call(this);
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
  };

  function _createLayout() {
    this.layout = new HeaderFooterLayout({
      headerSize: 60
    });

    this.headerModifier = new Modifier({});

    var header = new Surface({
      size: [undefined, undefined],
      properties: {
        backgroundColor: '#F2F2F2'
      }
    });

    this.layout.header.add(this.headerModifier).add(header);
    this.add(this.layout);
  }

  function _createDaysOfWeekBar() {
    // create static days of the week bar
    var fontColor;
    var letterSurface;
    var letterSurfaces = [];
    var letterGridModifier;
    var dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    var letterGrid = new GridLayout({
      dimensions: [7, 1]
    });

    letterGrid.sequenceFrom(letterSurfaces);

    for (var i = 0; i < dayLetters.length; i++) {
      fontColor = (i === 0 || i === 6) ? 'grey' : 'black';

      letterSurface = new Surface({
        size: [undefined, 12],
        content: dayLetters[i],
        properties: {
          textAlign: 'center',
          fontFamily: 'sans-serif',
          fontSize: '8px',
          color: fontColor
        }
      });

      letterSurfaces.push(letterSurface);
    }

    letterGridModifier = new Modifier({
      size: [undefined, 12],
      transform: Transform.translate(0, 48, 5)
    });

    this.add(letterGridModifier).add(letterGrid);
  }

  module.exports = AppView;
});