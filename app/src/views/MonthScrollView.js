define(function(require, exports, module) {
  var ViewSequence       = require('famous/core/ViewSequence');
  var ScrollView         = require('famous/views/Scrollview');
  var RenderNode         = require('famous/core/RenderNode');
  var Modifier           = require('famous/core/Modifier');
  var Easing             = require('famous/transitions/Easing');
  var Transform          = require('famous/core/Transform');
  var Surface            = require('famous/core/Surface');
  var MonthView          = require('views/MonthView');
  var DateConstants      = require('config/DateConstants');
  var InfiniteScrollView = require('views/InfiniteScrollView');
  var Transitionable     = require('famous/transitions/Transitionable');
  
  function MonthScrollView() {
    InfiniteScrollView.apply(this, arguments);
    this.setOptions(MonthScrollView.DEFAULT_OPTIONS);
    
    this.months = [];
    this.monthViews = [];
    this.monthModifiers = [];
    this.year;
    
    this.viewSequence = new ViewSequence({
      array: this.monthViews,
      loop: true
    });

    this.sequenceFrom(this.viewSequence);
    this.updateNodeBuffer = _updateNodeBuffer;
    _createMonthViews.call(this);
  }
  
  MonthScrollView.DEFAULT_OPTIONS = {
    maxMonthViews: 24,
  };
  
  MonthScrollView.prototype = Object.create(InfiniteScrollView.prototype);
  MonthScrollView.prototype.constructor = MonthScrollView;
  
  MonthScrollView.prototype.moveAdjacentMonths = function(amount) {
    var before = (this.selectedIndex + this.monthViews.length - 1) % this.monthViews.length;
    var after = (this.selectedIndex + 1) % this.monthViews.length;
    this.monthModifiers[before].setTransform(Transform.translate(0, amount[0], 0), {
      duration: 500,
      curve: Easing.outQuart
    });
    this.monthModifiers[after].setTransform(Transform.translate(0, amount[1], 0), {
      duration: 500,
      curve: Easing.outQuart
    });
  };

  MonthScrollView.prototype.determineOffset = function() {
    var position = this.getPosition();
    var index = this._node.getIndex();

    return (this.selectedIndex === index) ? position : -(window.innerHeight - 60) + position;
  }
  
  function _createMonthViews() {
    var date = new Date();
    var month = date.getMonth();
    var year = this.year = date.getFullYear();
    var startArr = [];
    var endArr = [];
    var nextMonth;
    var prevMonth;

    for (var i = 0; i < Math.floor(this.options.maxMonthViews / 2); i++) {
      startArr.push({ month: month, year: year });
      nextMonth = DateConstants.calcNextMonth(month, year);
      month = nextMonth.month;
      year = nextMonth.year;
    }

    month = date.getMonth();
    year = date.getFullYear();

    for (var i = 0; i < Math.floor(this.options.maxMonthViews / 2); i++) {
      prevMonth = DateConstants.calcPreviousMonth(month, year);
      month = prevMonth.month;
      year = prevMonth.year;
      endArr.push({ month: month, year: year });
    }

    startArr = startArr.concat(endArr.reverse());

    for (var views = 0; views < startArr.length; views++) {
      var monthView = new MonthView({
        scrollView: this,
        highlightModifier: this.options.highlightModifier,
        month: startArr[views].month,
        year: startArr[views].year
      });

      var renderNode = new RenderNode();
      var monthViewModifier = new Modifier();

      renderNode.add(monthViewModifier).add(monthView);
      this.monthModifiers.push(monthViewModifier);
      this.months.push(monthView);

      this.monthViews.push(renderNode);
      this._eventInput.subscribe(monthView._eventOutput);
      monthView._eventInput.subscribe(this._eventOutput);
    }

    this._eventInput.on('back', function(clickData) {
      // reactivate scrolling on selected week
      this.months[this.selectedIndex].weeks[this.selectedDate.week].surface.pipe(this);

      _animateWeeks.call(this, 0, this.selectedDate.week);
      this.selectedDate = undefined;
      this.selectedWeek.selectedDay = undefined;
    }.bind(this));

    this._eventInput.on('dateSelected', function(weekView) {
      if (this.selectedDate) {
        this.selectedDate = weekView.getDate();
        this._eventOutput.emit('toggleSelectedDate', weekView);
      } else {

        this.selectedDate = weekView.getDate();
        this.selectedIndex = _getSelectedIndex.call(this);

        // deactivate scrolling on selected week
        this.months[this.selectedIndex].weeks[this.selectedDate.week].surface.unpipe(this);

        this._eventOutput.emit('stateChangeDayView', weekView); // listened to by AppView
        _animateWeeks.call(this, (-(this.selectedDate.week) * ((window.innerHeight - 60)/7)) - (window.innerHeight/60) + this.determineOffset(), this.selectedDate.week);
      }
    }.bind(this));
  }

  function _getSelectedIndex() {
    for (var i = 0; i < this.monthViews.length; i++) {
      if (this.months[i].options.month === this.selectedDate.month && this.months[i].options.year === this.selectedDate.year) {
        return i;
      }
    }

    return -1;
  }

  function _animateWeeks(amount, row) {
    var bottomMovement = amount ? window.innerHeight : 0;
    var bottomDuration = amount ? 500 : 500;
    var backgroundOpacity = amount ? 0.01 : 0.99;
    var zIndex = amount ? 2 : 1;
    var currentMonth = this.months[this.selectedIndex];

    this.moveAdjacentMonths([amount, bottomMovement]);

    for (var i = 0; i < currentMonth.weeks.length; i++) {
      currentMonth.mods[i].halt();
      if (i === row) {
        currentMonth.weeks[i].modifier.halt();
        this.options.highlightModifier.halt();
        this.options.highlightModifier.setTransform(Transform.translate(0, amount, 6), {
          duration: 500,
          curve: Easing.outQuart
        });
        currentMonth.mods[i].setTransform(Transform.translate(0, amount, zIndex), {
          duration: 500,
          curve: Easing.outQuart
        });
      } else if (i < row) {
        // rows above selected row get pushed up
        currentMonth.mods[i].setTransform(Transform.translate(0, amount, 0), {
          duration: 500,
          curve: Easing.outQuart
        });
      } else {
        // rows below selected row get pushed down
        currentMonth.mods[i].setTransform(Transform.translate(0, bottomMovement, 0), {
          duration: bottomDuration,
          curve: Easing.outCubic
        });
      }
    }
  }

  function _updateNodeBuffer(oldNode, currentNode, indexOffset, targetIndex, currentIndex) {
    var currentYear = this.months[currentIndex].getMonth().year;
    if (this.year !== currentYear) {
      this._eventOutput.emit('updateYear', currentYear);
      this.year = currentYear;
    }

    oldNode = this.months[targetIndex];

    if (indexOffset < 0) {
      var oldMonth = this.months[(targetIndex + 1) % this.months.length].getMonth();
      if (oldMonth.month === 0) {
        oldNode.setMonth(11, oldMonth.year - 1);
      } else {
        oldNode.setMonth(oldMonth.month - 1, oldMonth.year);
      }
    } else {
      var oldMonth = this.months[(targetIndex - 1 + this.months.length) % this.months.length].getMonth();
      if (oldMonth.month === 11) {
        oldNode.setMonth(0, oldMonth.year + 1);
      } else {
        oldNode.setMonth(oldMonth.month + 1, oldMonth.year);
      }
    }
  };
  
  module.exports = MonthScrollView;
});
