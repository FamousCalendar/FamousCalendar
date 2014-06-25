//utilities

define(function(require, exports, module){


	 //Retrieve _calendar for date from local storage
	var _calendar = JSON.parse(window.localStorage.getItem('calendar'))|| {};

	var Utilities = {};



	Utilities.saveEvent = function saveEvent(newEvent) {

	  var eventDate = newEvent.date;
	  var dateObj = new Date(newEvent.date);
	  var recurrence = newEvent.repeat;


	  // //Check if any _calendar exist
	  // if(_calendar === null){

	  //   //Initialize _calendar to object
	  //   _calendar = {};
	  // }else{

	  //   //Parse _calendar array from string
	  //   _calendar = JSON.parse(_calendar);
	  // }


	  //Object schema:
	  //{date: eventToBeSaved.date, 
	  // start: eventToBeSaved.start, 
	  // end: eventEndTime, 
	  // repeat: eventRepetition,
	  // title: eventTitle, 
	  // description: eventBody};

	  if(recurrence !== 'false'){
	  	if(recurrence === 'daily'){
	  		_calendar.repeat['daily'] = _calendar.repeat['daily'] || [];
	  		_calendar.repeat['daily'].push(newEvent);
	  	}else if(recurrence === 'weekly'){
	  		_calendar.repeat['weekly'] = _calendar.repeat['weekly'] || {};
	  		_calendar.repeat['weekly'][dateObj.getDay()] = _calendar.repeat['weekly'][dateObj.getDay()] || [];
	  		_calendar.repeat['weekly'][dateObj.getDay()].push(newEvent);
	  	}else if(recurrence === 'monthly'){
	  		_calendar.repeat.recurrence[eventDate.slice(-2)] = _calendar.repeat.recurrence[eventDate.slice(-2)] || [];
	  		_calendar.repeat.recurrence[eventDate.slice(-2)].push(newEvent);
	  	}else if(recurrence === 'yearly'){
	  		_calendar.repeat.recurrence[eventDate.slice(5)] = _calendar.repeat.recurrence[eventDate.slice(5)] || [];
	  		_calendar.repeat.recurrence[eventDate.slice(5)].push(newEvent);
	  	}
	  	_calendar.repeat[recurrence][day] = newEvent;
	  }

	  _calendar.eventDate = _calendar.eventDate || [];
	  //add new event to _calendar array
	  _calendar.eventDate.push(newEvent);

	  //Store updated _calendar array in local storage
	  window.localStorage.setItem('calendar', JSON.stringify(_calendar));
	};

	Utilities.getCalendar = function(){
		return _calendar;
	}

	Utilities.getEvents = function getEvents(date){

	  //returns _calendar array for given date
	  return _calendar.date;

	};

	module.exports = Utilities;
});