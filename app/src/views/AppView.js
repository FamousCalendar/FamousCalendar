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
  var Easing = require('famous/transitions/Easing');
  var DayView = require('views/DayView');
  var DayScrollView = require('views/DayScrollView');
  var DateConstants = require('config/DateConstants');
  var MonthScrollView = require('views/MonthScrollView');

  function AppView() {
    View.apply(this, arguments);
    this.headerTransition = new Transitionable([undefined, 60]);
    this.state = 'monthView';

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

  // root layout
  function _createLayout() {
    this.layout = new HeaderFooterLayout({
      headerSize: this.options.headerSize,
      footerSize: 0
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

    this.backgroundModifier = new Modifier({
      transform: Transform.translate(0, 0, 3)
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
          fontSize: '10px',
          color: fontColor
        }
      });

      letterSurfaces.push(letterSurface);
    }

    letterGridModifier = new Modifier({
      size: [undefined, 14],
      transform: Transform.translate(0, 44, 5)
    });


    // back icon
    var backIcon = new ImageSurface({
      size: [30, 30],
      content:'content/images/back_arrow.png',
      properties: {
        pointerEvents: 'none'
      }
    });

    var backIconModifier = new Modifier({
      align: [0.045, 0.4],
      origin: [0.5, 0.5],
      transform: Transform.translate(0, 0, 3)
    });


    // title surface
    this.titleSurface = new Surface({
      size: [100, 60],
      content: '2014',
      properties: {
        color: 'red',
        textAlign: 'left',
        lineHeight: '48px',
        fontSize: '16px',
        fontFamily: 'sans-serif'
      }
    });

    this.titleModifier = new Modifier({
      align: [0.24, 0.5],
      origin: [0.5, 0.5],
      opacity: 0.999,
      transform: Transform.translate(0, 0, 3)
    });

    this.dateStringSurface = new Surface({
      size:[undefined, 20],
      content: '',
      properties: {
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontSize: '16px'
      }
    });

    this.dateStringModifier = new Modifier({
      opacity: 0.001,
      transform: Transform.translate(0, 140, 5)
    });

    this.layout.header.add(this.dateStringModifier).add(this.dateStringSurface);
    this.layout.header.add(this.backgroundModifier).add(backgroundSurface);
    this.layout.header.add(this.titleModifier).add(this.titleSurface);
    this.layout.header.add(backIconModifier).add(backIcon);
    this.add(letterGridModifier).add(letterGrid);
  }


  function _createContent() {
    // this.monthView = new MonthView({
    //   month: 6,
    //   year: 2014
    // });

    this.monthScrollView = new MonthScrollView();

    this.monthMod = new Modifier({
      transform: Transform.translate(0, 0, 1)
    });

    this.dayScrollView = new DayScrollView();

    this.dayScrollModifier = new Modifier({
      opacity: 0.01,
      transform: Transform.translate(0, 130, 0)
    });

    this.layout.content.add(this.dayScrollModifier).add(this.dayScrollView);
    this.layout.content.add(this.monthMod).add(this.monthScrollView);
    this.monthScrollView.subscribe(this._eventOutput);
    this._eventInput.subscribe(this.monthScrollView._eventOutput);
  }

  function _setListeners() {
    // when user clicks the button in header (the text not the back icon currently)
    this.titleSurface.on('click', function(data) {
      // short-circuited when in monthView because there currently is no yearView yet
      if (this.state === 'monthView') return;

      _setTitleSurface.call(this, '2014');

      // emit back event to MonthScrollView -> MonthView
      this._eventOutput.emit('back', data);
    }.bind(this));

    // user clicked on a date -- bubbled up from DayBoxView -> WeekView -> MonthView -> AppView
    this._eventInput.on('dayView', function(data) {
      this.state = 'dayView';
      this.currentRow = data.getDate().week;

      // transition in day scroller
      this.dayScrollModifier.halt();
      this.dayScrollModifier.setTransform(Transform.translate(0, ((window.innerHeight - 60)/6) * this.currentRow, 0));
      this.dayScrollModifier.setOpacity(0.99);
      this.dayScrollModifier.setTransform(Transform.translate(0, 130, 0), {duration: 500, curve: Easing.outQuart });

      // update content of back/title surface with month name
      _setTitleSurface.call(this, DateConstants.monthNames[data.getDate().month]);

      // transition header size based on current state
      _toggleHeaderSize.call(this, data);
    }.bind(this));

    this._eventInput.on('monthView', function(data) {
      this.state = 'monthView';
      this.dayScrollModifier.halt();
      this.dayScrollModifier.setTransform(Transform.translate(0, ((window.innerHeight - 60)/6) * this.currentRow, 0),
        {duration: 500, curve: Easing.outQuart }, function() {
          this.dayScrollModifier.setOpacity(0.01);
        }.bind(this));

      _setTitleSurface.call(this, '2014');
      _toggleHeaderSize.call(this, data);
    }.bind(this));

    // user clicks another day while one is already selected in header
    this._eventInput.on('changeDate', function(data) { 
      _transitionDateString.call(this, data);
    }.bind(this));
  }

  // transition for updating content in back/title surface, called whenever there is a change in state
  function _setTitleSurface(title) {
    this.titleModifier.halt();
    this.titleModifier.setOpacity(0.001, { duration: 200, curve: 'easeIn' }, function() {
      this.titleSurface.setContent(title);
      this.titleModifier.setOpacity(0.999, { duration: 200, curve: 'easeIn' });
    }.bind(this));
  }

  // header bar transition
  function _toggleHeaderSize(data) {
    var height = (this.state === 'dayView') ? 130 : 60;
    this.headerTransition.halt();
    this.backgroundModifier.halt();
    this.dateStringModifier.halt();
    this.headerTransition.set([undefined, height], {duration: 700, curve: Easing.outQuint});
    this.backgroundModifier.sizeFrom(this.headerTransition);

    if (height === 130) {
      var date = data.getDate();
      this.dateStringSurface.setContent(DateConstants.daysOfWeek[date.weekDay] + 
        ' ' + DateConstants.monthNames[date.month] + ' ' + date.day + ', ' + date.year);
      this.dateStringModifier.setTransform(Transform.translate(0, 100, 5), { duration: 650, curve: Easing.outExpo });
      this.dateStringModifier.setOpacity(0.999, {duration: 325, curve: Easing.inQuart});
    } else {
      this.dateStringModifier.setOpacity(0.001, {duration: 150, curve: Easing.outExpo});
      this.dateStringModifier.setTransform(Transform.translate(0, 140, 5), { duration: 550, curve: Easing.outExpo });
    }
  }

  // transitions displayed date string in header when going between selected dates 
  function _transitionDateString(data) {
    var date = data.getDate();
    this.dateStringModifier.halt();
    this.dateStringModifier.setOpacity(0.001);
    this.dateStringSurface.setContent(DateConstants.daysOfWeek[date.weekDay] + 
      ' ' + DateConstants.monthNames[date.month] + ' ' + date.day + ', ' + date.year);

    if (data.difference > 0) {
      this.dateStringModifier.setTransform(Transform.translate(-40, 100, 5));
      this.dateStringModifier.setOpacity(0.999, {duration: 600, curve: Easing.outCubic});
      this.dateStringModifier.setTransform(Transform.translate(0, 100, 5), { duration: 700, curve: Easing.outQuart });
    } else {
      this.dateStringModifier.setTransform(Transform.translate(40, 100, 5));
      this.dateStringModifier.setOpacity(0.999, {duration: 600, curve: Easing.outCubic});
      this.dateStringModifier.setTransform(Transform.translate(0, 100, 5), { duration: 700, curve: Easing.outQuart });
    }
  }

  module.exports = AppView;
});