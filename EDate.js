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
function EDate(date) {
	var objDate = new Date();
	
	var patt_function = [
		{
			'pattern': /^\d\d-\d\d-\d\d\d\d$/i,
			'func' : function(date) {
				return new Date(date.substring(6,10) + '-' + date.substring(3,5) + '-' + date.substring(0,2));
			}
		},
		{
			'pattern': /^christmas$/i,
			'func': function() {return new Date('2011-12-25');}
		},
		{
			'pattern': /^yesterday$/i,
			'func': function(){
				var d = new EDate();
				d.addTime('-1 day');
				return d;
			}
		},
		{
			'pattern': /^tomorrow$/i,
			'func': function(){
				var d = new EDate();
				d.addTime('+1 day');
				return d;
			}
		},
		{
			'pattern': /^año del caldo$/i,
			'func': function(){
				return new Date(-10000000000000);
			}
		},
	];
	
	for(i in patt_function){
		exp = new RegExp(patt_function[i].pattern);
		if (exp.exec(date) !== null) {
			objDate = patt_function[i].func(date);
			break;
		}
	}
	
	objDate.toString = function(){
		return objDate.toUTCString();
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
				this.setMonth(this.getMonth() + (time * 1));
				break;
			case 'year':
				this.setFullYear(this.getFullYear() + (time * 1));
				break;
		}
	};
	
	objDate.next = function(string){
		string = string || 'day';
		if (this.dow[string] !== undefined) {
			var lapse = 0;
			if (this.dow[string] > this.getUTCDay()) {
				lapse = this.dow[string] - this.getUTCDay();
			}
			else{
				lapse = 7 + this.dow[string] - this.getUTCDay();
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
		
		if (this.dow[string] !== undefined) {
			var lapse = 0;
			if (this.dow[string] < this.getUTCDay()) {
				lapse = this.getUTCDay() - this.dow[string];
			}
			else{
				lapse = 7 + this.getUTCDay() - this.dow[string];
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
	
	objDate.last = function(string) {
		this.previous(string);
	}
	
	objDate.dow = {
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
	
	objDate.locale = 'es';
	
	objDate.getLocale = function(){
		return this.locale;
	}
	
	objDate.setLocale = function(locale){
		this.locale = locale;
	}
	
	objDate.isLeapYear = function(year) {
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
			d: this.getUTCDate(),
			m: this.getUTCMonth(),
			Y: this.getUTCFullYear(),
			h: this.getUTCHours(),
			i: this.getUTCMinutes(),
			s: this.getUTCSeconds(),
			D: this.days_of_week[this.locale][this.getUTCDay()],
			M: this.months_of_year[this.locale][this.getUTCMonth()],
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
	
	return objDate;
}