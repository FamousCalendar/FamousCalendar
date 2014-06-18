/*** DayView.js ***/

define(function(require, exports, module) {
  //  Dependencies
  var View  = require('famous/core/View');
  
  var TimelineView  = require('views/TimelineView');
  
  function DayView() {
    View.apply(this, arguments);
    
    //  Instantiate settings/options
    
    //  Instantiate Timebar
    _createTimeline.call(this);
    //  Instantiate Rows
    _createRows.call(this);
    //  Instantiate Events
    this.loadEvents();
  }
  
  DayView.DEFAULT_OPTIONS = {
    rowColorDayPrimary: 'FFFF66',
    rowColorDayOffset: 'FFFF99',
    rowColorNightPrimary: 'FF99CC',
    rowColorNightOffset: 'FFCCFF',
    fontColor: '000000'
  };
  
  //  Prototype Functions
  DayView.prototype = Object.create(View.prototype);
  DayView.prototype.constructor = DayView;
  
  DayView.prototype.getSize = function getSize() {
    //  return [x,y] dimensions of entire view
    //  This function is called by scrollview to determine spacing of each element in the scroll's collection
  };  //  End DayView.prototype.getSize
  
  DayView.prototype.loadEvents = function loadEvents() {
    //  Instantiates the collection of event surfaces and their modifiers for a given day.
    //  Called each time the ScrollView cycles a DayView from one end of the collection to the other
  };  //  End DayView.prototype.loadEvents
  
  //  Helper Functions
  function _createTimeline() {};  //  End _createTimeline
  
  function _createRows() {};  //  End _createRows
  
  module.exports = DayView;
});