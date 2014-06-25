define(function(require, exports, module) {
  var ViewSequence  = require('famous/core/ViewSequence');
  var ScrollView    = require('famous/views/Scrollview');
  var RenderNode    = require('famous/core/RenderNode');
  var Modifier      = require('famous/core/Modifier');
  var Easing        = require('famous/transitions/Easing');
  var Transform     = require('famous/core/Transform');
  
  var MonthView = require('views/MonthView');
  
  // currently this is 85*4=340 surfaces
  function MonthScrollView() {
    ScrollView.apply(this, arguments);
    this.setOptions(MonthScrollView.DEFAULT_OPTIONS);
    
    this.months = [];
    this.monthViews = [];
    this.monthModifiers = [];
    
    this.viewSequence = new ViewSequence({
      array: this.monthViews,
      loop: true
    });
    this.sequenceFrom(this.viewSequence);
    
    _createMonthViews.call(this);
  }
  
  MonthScrollView.DEFAULT_OPTIONS = {
    maxMonthViews: 4
  };
  
  MonthScrollView.prototype = Object.create(ScrollView.prototype);
  MonthScrollView.prototype.constructor = MonthScrollView;
  
  // responcible for animating adjacent months that might be in view off the screen when day is selected
  MonthScrollView.prototype.moveAdjacentMonths = function(amount) {
    var before = (this.selectedIndex + this.monthViews.length - 1) % this.monthViews.length;
    var after = (this.selectedIndex + 1) % this.monthViews.length;
    this.monthModifiers[before].setTransform(Transform.translate(0, amount[0], 0), {
      duration: 500,
      curve: Easing.outQuart
    });
    this.monthModifiers[after].setTransform(Transform.translate(0, amount[1].movement, 0), {
      duration: amount[1].duration,
      curve: Easing.outQuart
    });
  }
  
  function _createMonthViews() {
    for (var views = 0; views < this.options.maxMonthViews; views++) {
      var monthView = new MonthView({
        scrollView: this,
        month: views,
        year: 2014
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

    this._eventInput.on('dayView', function(data) {
      // capture the selected month
      this.selectedMonth = data.getDate().month;
      for (var i = 0; i < this.monthViews.length; i++) {
        console.log(this.monthViews[i].get());
        if (this.months[i].options.month === this.selectedMonth) {
          this.selectedIndex = i;
          break;
        }
      }
      this._eventOutput.emit('dayView', data);
    }.bind(this));

    this._eventInput.on('monthView', function(data) {
      this._eventOutput.emit('monthView', data);
    }.bind(this));

    this._eventInput.on('changeDate', function(data) {
      this._eventOutput.emit('changeDate', data);
    }.bind(this));

    this._eventInput.on('back', function(data) {
      this._eventOutput.emit('back', { data: data, month: this.selectedMonth });
    }.bind(this));

    this._eventInput.on('moveAdjacentMonths', function(data) {
      this.moveAdjacentMonths(data);
    }.bind(this));
  }
  
  module.exports = MonthScrollView;
});
