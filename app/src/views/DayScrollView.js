/*** DayScrollView.js ***/

define(function(require, exports, module) {
  var ViewSequence  = require('famous/core/ViewSequence');
  var ScrollView    = require('famous/views/Scrollview');
  
  var DayView = require('views/DayView');
  
  function DayScrollView() {
    ScrollView.apply(this, arguments);
    this.setOptions(DayScrollView.DEFAULT_OPTIONS);
    
    this.dayViews = [];
    this.viewSequence = new ViewSequence({
      array: this.dayViews,
      loop: true
    });
    this.sequenceFrom(this.viewSequence);
    
    _createDayViews.call(this);
  }
  
  DayScrollView.DEFAULT_OPTIONS = {
    maxDayViews: 4
  };
  
  DayScrollView.prototype = Object.create(ScrollView.prototype);
  DayScrollView.prototype.constructor = DayScrollView;
  
  function _createDayViews() {
    for (var views = 0; views < this.options.maxDayViews; views++) {
      this.dayViews.push(new DayView({
        scrollView: this
      }));
    }
  }
  
  module.exports = DayScrollView;
});
