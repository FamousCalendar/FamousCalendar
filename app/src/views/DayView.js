/*** DayView.js ***/

define(function(require, exports, module) {
  //  Dependencies
  var View  = require('famous/core/View');
  
  var RowsView      = require('views/RowsView');
  var TimelineView  = require('views/TimelineView');
  var AppSettings   = require('config/AppSettings');
  
  function DayView() {
    View.apply(this, arguments);
    
    //  Instantiate settings/options
    
    //  Instantiate Rows
    _createRows.call(this);
    //  Instantiate Timebar
    _createTimeline.call(this);
    //  Instantiate Events
    this.loadEvents();
  }
  
  DayView.DEFAULT_OPTIONS = {
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
  function _createRows() {
    var rows = new RowsView();
    this.add(rows);
  };  //  End _createRows
  
  function _createTimeline() {
    var timeline = new TimelineView();
    this.add(timeline);
  };  //  End _createTimeline
  
  module.exports = DayView;
});