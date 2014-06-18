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
  var MonthView = require('views/MonthView');

  function AppView() {
    View.apply(this, arguments);

    _createLayout.call(this);
    _createHeader.call(this);
    _createContent.call(this);
    _setListeners.call(this);
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
      transform: Transform.translate(0, 0, 2)
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
      origin: [0.5, 0.5],
      transform: Transform.translate(0, 0, 3)
    });


    // title surface
    this.titleSurface = new Surface({
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

    this.titleSurface.on('click', function(data) {
      // temporary hack
      if (this.titleSurface.getContent() === '2014') return;

      _setTitleSurface.call(this, '2014');
      this._eventOutput.emit('back', data);
    }.bind(this));

    this.titleModifier = new Modifier({
      align: [0.15, 0.5],
      origin: [0.5, 0.5],
      opacity: 0.999,
      transform: Transform.translate(0, 0, 3)
    });

    this.layout.header.add(backgroundModifier).add(backgroundSurface);
    this.layout.header.add(this.titleModifier).add(this.titleSurface);
    this.layout.header.add(backIconModifier).add(backIcon);
    this.add(letterGridModifier).add(letterGrid);
  }


  function _createContent() {
    this.monthView = new MonthView();
    this.monthMod = new Modifier({
      transform: Transform.translate(0, 48, 0)
    });

    this.layout.content.add(this.monthMod).add(this.monthView);
    this.monthView.subscribe(this._eventOutput);
    this._eventInput.subscribe(this.monthView._eventOutput);
  }

  function _setListeners() {
    this._eventInput.on('dayView', function(data) {
      _setTitleSurface.call(this, 'June');
    }.bind(this));

    this._eventInput.on('monthView', function(data) {
      _setTitleSurface.call(this, '2014');
    }.bind(this));
  }

  function _setTitleSurface(title) {
    this.titleModifier.setOpacity(0.001, { duration: 200, curve: 'easeIn' }, function() {
      this.titleSurface.setContent(title);
      this.titleModifier.setOpacity(0.999, { duration: 200, curve: 'easeIn' });
    }.bind(this));
  }

  module.exports = AppView;
});