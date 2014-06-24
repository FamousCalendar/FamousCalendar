//utilities

define(function(require, exports, module){

	function Utilities(){
		this.saveEvent = function saveEvent(newEvent) {
		  var eventDate = newEvent.date;
		  console.log(eventDate);

		  //Retrieve events for date from local storage
		  var events = window.localStorage.getItem(eventDate);

		  //Check if any events exist
		  if(events === null){

		    //Initialize events to array
		    events = [];
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
		  
		  //add new event to events array
		  events.push(newEvent);
		  //Store updated events array in local storage
		  window.localStorage.setItem(eventDate, JSON.stringify(events));
		};
	}

	module.exports = Utilities;
});