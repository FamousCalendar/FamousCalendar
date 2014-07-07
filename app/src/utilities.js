//utilities

define(function(require, exports, module){

	 //Retrieve _calendar for date from local storage
	var _calendar = JSON.parse(window.localStorage.getItem('calendar')) || {};
	_calendar.repeat = _calendar.repeat || {};
	_calendar.currentID = _calendar.currentID || 0;
	_calendar.repeat['daily'] = _calendar.repeat['daily'] || [];
	_calendar.repeat['weekly'] = _calendar.repeat['weekly'] || {};
	_calendar.repeat['monthly'] = _calendar.repeat['monthly'] || {};
	_calendar.repeat['yearly'] = _calendar.repeat['yearly'] || {};

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
	  		_calendar.repeat['daily'].push(newEvent);
	  	}else if(recurrence === 'weekly'){
	  		_calendar.repeat['weekly'][dateObj.getDay()] = _calendar.repeat['weekly'][dateObj.getDay()] || [];
	  		_calendar.repeat['weekly'][dateObj.getDay()].push(newEvent);
	  	}else if(recurrence === 'monthly'){
	  		_calendar.repeat[recurrence][eventDate.slice(-2)] = _calendar.repeat[recurrence][eventDate.slice(-2)] || [];
	  		_calendar.repeat[recurrence][eventDate.slice(-2)].push(newEvent);
	  	}else if(recurrence === 'yearly'){
	  		_calendar.repeat[recurrence][eventDate.slice(5)] = _calendar.repeat[recurrence][eventDate.slice(5)] || [];
	  		_calendar.repeat[recurrence][eventDate.slice(5)].push(newEvent);
	  	}
	  }

	  _calendar[eventDate] = _calendar[eventDate] || [];
	  //add new event to _calendar array

	  newEvent.eventID = _calendar.currentID++;
	  _calendar[eventDate].push(newEvent);

	  //Store updated _calendar array in local storage
	  window.localStorage.setItem('calendar', JSON.stringify(_calendar));
	};

	Utilities.getCalendar = function(){
		return _calendar;
	}

	Utilities.hasEvents = function hasEvents(date){
		var dateEvents = _calendar[date] || [];
		var dailyEvents = _calendar.repeat.daily || [];
		var weeklyEvents = _calendar.repeat.weekly[new Date(date).getDay()] || [];
		var monthlyEvents = _calendar.repeat.monthly[date.slice(-2)] || [];
		var yearlyEvents = _calendar.repeat.yearly[date.slice(5)] || [];

		return (dateEvents.concat(dailyEvents, weeklyEvents, monthlyEvents, yearlyEvents).length > 0);
	}

	Utilities.getEvents = function getEvents(date){
      var result = [];
      var dateEvents = _calendar[date] || [];
      var dailyEvents = _calendar.repeat.daily || [];
      var weeklyEvents = _calendar.repeat.weekly[new Date(date).getDay()] || [];
      var monthlyEvents = _calendar.repeat.monthly[date.slice(-2)] || [];
      var yearlyEvents = _calendar.repeat.yearly[date.slice(5)] || [];
	  //returns _calendar array for given date
	  return result.concat(dateEvents, dailyEvents, weeklyEvents, monthlyEvents, yearlyEvents);

	};

	function _findEvent(event, callback){
		var dateArray = _calendar[event.date] || [];
		for(var x = 0; x < dateArray.length; x++){
			if(dateArray[x] === event){
				callback(dateArray, dateArray[x], x);
			}
		}
		if(event.repeat === 'daily'){
			var dailyArray = _calendar.repeat.daily;
			for(var x = 0; x < dailyArray.length; x++){
				if(dailyArray[x].title === event.title && dailyArray[x].start === event.start){
					callback(dailyArray, dailyArray[x], x);
				}
			}
		}else if(event.repeat === 'weekly'){
			var weeklyArray = _calendar.repeat.weekly[new Date(event.date).getDay()];
			for(var x = 0; x < weeklyArray.length; x++){
				if(weeklyArray[x].title === event.title && weeklyArray[x].start === event.start && weeklyArray[x].end === event.end){
					callback(weeklyArray, weeklyArray[x], x);
				}
			}
		}else if(event.repeat === 'monthly'){
			var monthlyArray = _calendar.repeat.monthly[event.date.slice(-2)];
			for(var x = 0; x < monthlyArray.length; x++){
				if(monthlyArray[x].title === event.title && monthlyArray[x].start === event.start && monthlyArray[x].end === event.end){
					callback(monthlyArray, monthlyArray[x], x);
				}
			}
		}else if(event.repeat === 'yearly'){
			var yearlyArray = _calendar.repeat.yearly[event.date.slice(5)];
			for(var x = 0; x < yearlyArray.length; x++){
				if(yearlyArray[x].title === event.title && yearlyArray[x].start === event.start && yearlyArray[x].end === event.end){
					callback(yearlyArray, yearlyArray[x], x);
				}
			}
		}
	}

	Utilities.deleteEvent = function(event){
		_findEvent(event, function(arr, item, index){
			arr.splice(index, 1);
		});
		window.localStorage.setItem('calendar', JSON.stringify(_calendar));
	};

	Utilities.editEvent = function(oldEvent, updatedEvent){
		_findEvent(oldEvent, function(arr, item, index){
			arr.splice(index, 1);
		});
		Utilities.saveEvent(updatedEvent);
		window.localStorage.setItem('calendar', JSON.stringify(_calendar));
	};

	//Must .bind(this)
	Utilities.createEvent = function _createEvent(){
	    return { 
	        title : this.titleField.getValue(),
	        date : this.dateField.getValue(),
	        location : this.locationField.getValue(),
	        start : this.startField.getValue(),
	        end : this.endField.getValue(),
	        repeat : this.repeatValue.value
	    };
	}




	module.exports = Utilities;
});