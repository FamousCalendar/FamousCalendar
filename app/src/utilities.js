//utilities

define(function(require, exports, module){

	var calendar;

	var Utilities = {};

	Utilities.saveEvent = function saveEvent(newEvent) {
	  var eventDate = newEvent.date;

	  //Retrieve events for date from local storage
	  var events = window.localStorage.getItem('calendar');


	  //Check if any events exist
	  if(events === null){

	    //Initialize events to object
	    events = {};
	  }else{

	    //Parse events array from string
	    events = JSON.parse(events);
	  }

	  //create new event object from input - TBD in Calling Function

	  //Object schema:
	  //{date: eventToBeSaved.date, 
	  // start: eventToBeSaved.start, 
	  // end: eventEndTime, 
	  // title: eventTitle, 
	  // description: eventBody};

	  events.eventDate = events.eventDate || [];
	  //add new event to events array
	  events.eventDate.push(newEvent);
	  

	  //Store updated events array in local storage
	  window.localStorage.setItem('calendar', JSON.stringify(events));
	};

	Utilities.getCalendar = function(){
		calendar = JSON.parse(window.localStorage.getItem('calendar'));
		return calendar;
	}

	Utilities.getEvents = function getEvents(date){
    if (!calendar) return {};
	  //returns events array for given date
	  return calendar.date;

	};

	module.exports = Utilities;
});