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

  function AppView() {
    View.apply(this, arguments);

    _createLayout.call(this);
    _createHeader.call(this);
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    headerSize: 60
  };

  function _createLayout() {
    this.layout = new HeaderFooterLayout({
      headerSize: this.options.headerSize
    });

    var layoutModifier = new Modifier({
      transform: Transform.translate(0, 0, 0.1)
    });

    this.add(layoutModifier).add(this.layout);
  }

  function _createHeader() {
    // background surface
    var backgroundSurface = new Surface({
      properties: {
        backgroundColor: '#FAFAFA',
        borderBottom: '1px solid lightgrey'
      }
    });

    var backgroundModifier = new Modifier({
      transform: Transform.behind
    });

    
    // static days of the week bar
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
        size: [undefined, 14],
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
      size: [undefined, 14],
      transform: Transform.translate(0, 46, 5)
    });


    // back icon
    var backIcon = new ImageSurface({
      size: [22, 22],
      content:'content/images/back_icon.png',
      properties: {
        pointerEvents: 'none'
      }
    });

    var backIconModifier = new Modifier({
      align: [0.06, 0.4],
      origin: [0.5, 0.5]
    });


    // year and month surfaces
    var yearSurface = new Surface({
      size: [100, undefined],
      content: '2014',
      properties: {
        color: 'red',
        textAlign: 'center',
        lineHeight: '50px',
        fontSize: '14px',
        fontFamily: 'sans-serif'
      }
    });

    var monthSurface = new Surface({
      content: 'June',
      properties: {
        color: 'red',
        textAlign: 'right',
        lineHeight: '50px',
        fontSize: '14px',
        fontFamily: 'sans-serif'
      }
    });

    this.yearModifier = new Modifier({
      align: [0.15, 0.5],
      origin: [0.5, 0.5],
      opacity: 0.999,
      transform: Transform.translate(0, 0, 3)
    });

    this.monthModifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
      opacity: 0.001,
      transform: Transform.translate(0, 0, 3)
    });

    this.layout.header.add(backgroundModifier).add(backgroundSurface);
    this.layout.header.add(this.yearModifier).add(yearSurface);
    this.layout.header.add(this.monthModifier).add(monthSurface);
    this.layout.header.add(backIconModifier).add(backIcon);
    this.add(letterGridModifier).add(letterGrid);
  }

  module.exports = AppView;
});