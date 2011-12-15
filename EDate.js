/*
Copyright (C) 2011 Juan José González <juanjosegzl@madeinsocial.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
function EDate(date, UTC_by_default) {
	
	/**
	 * Constructor
	 */
	UTC_by_default = UTC_by_default || false;
	
	var USEUTC = '';
	if (UTC_by_default) {
		USEUTC = 'UTC';
	}
	
	var objDate = new Date();
	var mapper_constructor = [
		{
			pattern: /^$/i,
			func: function() {
				return objDate;
			}
		},
		{
			pattern : /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}\s([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/i,
			func : function(date) {
				var d = new EDate('', UTC_by_default);
				d['set' + USEUTC + 'Date'](date.substring(0, 2));
				d['set' + USEUTC + 'Month']
						(parseInt(date.substring(3, 5)) - 1);
				d['set' + USEUTC + 'FullYear'](date.substring(6, 10));
				d['set' + USEUTC + 'Hours'](date.substring(11, 13), date
						.substring(14, 16), date.substring(17, 19), 0);
				return d;
			}
		},
		{
			'pattern': /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/i,
			'func' : function(date) {
				var d = new EDate('',UTC_by_default);
				d['set' + USEUTC + 'Date'](date.substring(0,2));
				d['set' + USEUTC + 'Month'](parseInt(date.substring(3,5)) - 1);
				d['set' + USEUTC + 'FullYear'](date.substring(6,10));
				d.midnight();
				return d;
			}
		},
		{
			'pattern': /^\d{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])$/i,
			'func' : function(date) {
				var d = new EDate('',UTC_by_default);
				d['set' + USEUTC + 'Date'](date.substring(8,10));
				d['set' + USEUTC + 'Month'](parseInt(date.substring(5,7)) - 1);
				d['set' + USEUTC + 'FullYear'](date.substring(0,4));
				d.midnight();
				return d;
			}
		},
		{
			'pattern': /yesterday/i,
			'func': function(){
				var d = new EDate('',UTC_by_default);
				d.addTime('-1 day');
				return d;
			}
		},
		{
			'pattern': /tomorrow/i,
			'func': function(){
				var d = new EDate('',UTC_by_default);
				d.addTime('+1 day');
				return d;
			}
		},
		{
			'pattern': /today/i,
			'func': function(){
				var d = new EDate('',UTC_by_default);
				d.midnight();
				return d;
			}
		},
	];
	
	var mapper_modifiers = [
		{
			pattern: /midnight/ig,
			func: function(objDate) {
				objDate.midnight();
				return objDate;
			}
		},
		{
			pattern: /noon/ig,
			func: function(objDate) {
				objDate.noon();
				return objDate;
			}
		},
		{
			pattern: / (0?[1-9]|1[0-2]) ?am/ig,
			func: function(objDate, matches) {
				objDate['set' + USEUTC + 'Hours'](matches[1],0,0,0);
				return objDate;
			}
		},
		{
			pattern: / (0?[1-9]|1[0-2]) ?pm/ig,
			func: function(objDate, matches) {
				objDate.setUTCHours(12 + parseInt(matches[1]) ,0,0,0);
				return objDate;
			}
		},
		{
			pattern: / ([0-1]?[1-9]|2[0-3]) ?hrs/ig,
			func: function(objDate, matches) {
				objDate.setUTCHours(parseInt(matches[1]) ,0,0,0);
				return objDate;
			}
		},
	];
	
	for(i in mapper_constructor){
		exp = new RegExp(mapper_constructor[i].pattern);
		if (exp.exec(date) !== null) {
			objDate = mapper_constructor[i].func(date);
			for ( j in mapper_modifiers) {
				exp2 = new RegExp(mapper_modifiers[j].pattern);
				matches = exp2.exec(date);
				if (matches !== null) {
					objDate = mapper_modifiers[j].func(objDate,matches);
				}
			}
			break;
		}
	}
	/*
	 * Ends constructor
	 */

	objDate.toString = function(){
		if ( ! UTC_by_default) {
			var date = new Date();
			date.setTime(objDate.getTime());
			return date.toString();
		}
		else {
			return objDate.toUTCString();
		}
	};
	
	objDate.addTime = function(string){
		var matches = new RegExp(/^([+|-]?\d+.?\d*) (second|minute|hour|day|week|month|year)s?$/i).exec(string);
		if (matches === null){
			return false;
		}
		var unit = matches[2];
		var time = matches[1];
		switch (unit) {
			case 'second':
				this.setTime(this.getTime() + (time * 1000));
				break;
			case 'minute':
				this.setTime(this.getTime() + (time * 60000));
				break;
			case 'hour':
				this.setTime(this.getTime() + (time * 3600000));
				break;
			case 'day':
				this.setTime(this.getTime() + (time * 86400000));
				break;
			case 'week':
				this.setTime(this.getTime() + (time * 604800000));
				break;
			case 'month':
				this['set' + USEUTC + 'Month'](this['get' + USEUTC + 'Month']() + (time * 1));
				break;
			case 'year':
				this['set' + USEUTC + 'FullYear'](this['get' + USEUTC + 'FullYear']() + (time * 1));
				break;
		}
		return this;
	};
	
	objDate.next = function(string){
		string = string || 'day';
		if (this.DOW[string] !== undefined) {
			var lapse = 0;
			if (this.DOW[string] > this['get' + USEUTC + 'Day']()) {
				lapse = this.DOW[string] - this['get' + USEUTC + 'Day']();
			}
			else{
				lapse = 7 + this.DOW[string] - this['get' + USEUTC + 'Day']();
			}
			if (lapse === 0) {
				lapse = 7;
			}
			this.addTime(lapse + ' days');
		}
		else {
			this.addTime('1 ' + string);
		}
	}

	objDate.previous = function(string){
		string = string || 'day';
		
		if (this.DOW[string] !== undefined) {
			var lapse = 0;
			if (this.DOW[string] < this['get' + USEUTC + 'Day']()) {
				lapse = this['get' + USEUTC + 'Day']() - this.DOW[string];
			}
			else{
				lapse = 7 + this['get' + USEUTC + 'Day']() - this.DOW[string];
			}
			if (lapse === 0) {
				lapse = 7;
			}
			this.addTime((lapse * -1) + ' days');
		}
		else {
			this.addTime('-1 ' + string);
		}
	}
	
	objDate.midnight = function(string) {
		this['set' + USEUTC + 'Hours'](0, 0, 0, 0);
		return this;
	}
	
	objDate.noon = function() {
		this['set' + USEUTC + 'Hours'](12, 0, 0, 0);
		return this;
	}
	
	objDate.today = function() {
		var d = new EDate();
		d.midnight();
		return d;
	}
	
	objDate.getDayName = function(number) {
		return this.days_of_week[this.locale][number];
	}

	objDate.getMonthName = function(number) {
		return this.months_of_year[this.locale][number];
	}
	
	objDate.getDayNumber = function(name) {
		var name = new String(name);
		name = name.toLowerCase();
		
		for (i in this.days_of_week){
			if (this.days_of_week[i] == name){
				return i;
			}
		}
		return false;
	}

	objDate.getMonthNumber = function(name) {
		var name = new String(name);
		name = name.toLowerCase();
		
		for (i in this.months_of_year){
			if (this.months_of_year[i] == name){
				return i;
			}
		}
		return false;
	}
	
	objDate.getDaysInMonth = function() {
		var d = new EDate();
		d['set' + USEUTC + 'Month'](parseInt(this['get' + USEUTC + 'Month']()) + 1, 1);
		d.previous('day');
		return d['get' + USEUTC + 'Date']();
	}
	
	objDate.cmp = function(comparation_date) {
		var one = this.getTime();
		var two = comparation_date.getTime();
		if (one === two) {
			return 0;
		}
		else if(one > two){
			return 1;
		}
		else {
			return -1;
		}
	}
	
	objDate.equals = function(comparation_date) {
		if (this.cmp(comparation_date) === 0){
			return true;
		}
		else{
			return false;
		}
	}
	
	objDate.last = function(string) {
		this.previous(string);
	}
	
	objDate.DOW = {
		sunday : 0,
		monday : 1,
		tuesday: 2,
		wednesday: 3,
		thursday: 4,
		friday: 5,
		saturday: 6
	};

	objDate.days_of_week = {
		es:['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
		en:['sunday','monday','tuesday','wednesday','thursday','friday','saturday'],
	};
	
	objDate.months_of_year = {
		es:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
		en:['january','february','march','april','may','june','july','august','september','october','november','december'],
	};
	
	objDate.locale = 'en';
	
	objDate.getLocale = function(){
		return this.locale;
	}
	
	objDate.setLocale = function(locale){
		this.locale = locale;
	}
	
	objDate.isLeapYear = function(year) {
		year = year || this['get' + USEUTC + 'FullYear']();
		
		if ( year % 4 === 0){
			if (year % 100 === 0) {
				if ( year % 400 === 0) {
					return true;
				}
				else{
					return false;
				}
			}
			else {
				return true;
			}
		}
		else {
			return false;
		}
	}
	
	objDate.format = function(format){
		var substitutions = {
			d: this['get' + USEUTC + 'Date'](),
			m: parseInt(this['get' + USEUTC + 'Month']()) + 1,
			Y: this['get' + USEUTC + 'FullYear'](),
			h: this['get' + USEUTC + 'Hours'](),
			i: this['get' + USEUTC + 'Minutes'](),
			s: this['get' + USEUTC + 'Seconds'](),
			D: this.days_of_week[this.locale][this['get' + USEUTC + 'Day']()],
			M: this.months_of_year[this.locale][this['get' + USEUTC + 'Month']()],
		},
			result = new String(),
			i = 0;
		for(;i < format.length; i++){
			if(format.charAt(i) == '\\'){
				continue;
			}
			if( format.charAt(i-1) != '\\'){
				if (typeof substitutions[format.charAt(i)] !== 'undefined') {
					var sub = new String(substitutions[format.charAt(i)]);
					if (sub.length < 2){
						sub = '0' + sub;
					}
					result += sub;
				}
				else{
					result += format.charAt(i);
				}
			}
			else{
				result += format.charAt(i);
			}
		}
		return result;
	}
	
	objDate.formatISO8601 = function() {
		return this.format('Y-m-dTh:i:sZ');
	}
	
	objDate.aproxgap = function(comparation_date) {
		var time1 = this.getTime();
		var time2 = comparation_date.getTime();
		
		var gap = Math.abs(time2 - time1);
		
		var data = {};
		data['years'] = gap  / (1000 * 60 * 60 * 24 * 365);
		data['months'] = data['years'] * 12;
		data['weeks'] = data['years'] * 52;
		data['days'] = gap  / (1000 * 60 * 60 * 24);
		data['hours'] = gap  / (1000 * 60 * 60);
		data['minutes'] = gap  / (1000 * 60);
		data['seconds'] = gap  / (1000);
		data['milliseconds'] = gap;
		
		return data;
	}
	
	objDate.timestamp = function(){
		return this.getTime() / 1000;
	}
	
	objDate.localToUTC = function() {
		var edate = new EDate('',true);
		edate.setTime(this.getTime());
		return edate;
	}
	
	objDate.UTCtoLocal = function() {
		var edate = new EDate();
		edate.setTime(this.getTime());
		return edate;
	}
	
	return objDate;
}