/**
 * ScaleMonitor Client
 *
 * Copyright (c) 2011 Frengstad Web Teknologi and contributors  
 * All rights reserved
 *
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the ScaleMonitor team nor the names of its contributors may be used
 * to endorse or promote products derived from this software without specific prior
 * written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY EXPRESS
 * OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS
 * AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * DOM helper functions
 *
 * @package	  eightval 
 * @version	  0.1 
 * @copyright Frengstad Web Teknologi	
 * @author	  Olav Frengstad <olav@fwt.no>
 * @license	  http://www.opensource.org/licenses/bsd-license.php BSD License
 */

//	Create object in global namespace
if ( typeof (Fwt) == "undefined" ) {
	Fwt = {};
}

/**
 * DOM helper functions
 */
Fwt.dom = function () {
	/**
	 * Check if an element have class set
	 * 
	 * @param element The element to check
	 * @param className The classname to check
	 * @return boolean True if element has class false otherwise
	 */
	this.hasClass = function ( element, className ) {
		var classes = element.className;
		var pattern = new RegExp("(^| )" + className + "($| )");

		return pattern.test( classes );
	};
	
	/**
	 * Remove class from element
	 * 
	 * @param element The element to check
	 * @param className The classname to check
	 * @return void
	 */
	this.removeClass = function ( element, className ) {
		element.className = element.className.replace( new RegExp("(^| )" + className + "($| )"), ' ' );
	};
	
	/**
	 * Add a class to the element
	 * 
	 * @param element The element to check
	 * @param className The classname to check
	 * @return boolean True if class was added, false otherwise
	 */
	this.addClass = function ( element, className ) {
		if ( ! this.hasClass( element, className ) )
		{
			element.className += " " + className
			return true;
		}
		
		return false;
	};

	/**
	 * Add an event listener to an object
	 * 
	 * All attributions to Scott Andrew LePera for this.
	 * http://www.scottandrew.com/weblog/articles/cbs-events
	 * 
	 * @param element The element to check
	 * @param event The event to handler
	 * @param handler The function to that handles the event
	 * @param useCapture 
	 * @return boolean Status of event addition
	 */
	this.addEvent = function ( obj, evType, fn, useCapture) {
		if (obj.length > 1) {
			for (i in obj)
				this.addEvent(obj[i], evType, fn, useCapture);

			return;
		}

		if (obj.addEventListener){
			obj.addEventListener(evType, fn, useCapture);
			return true;
		} else if (obj.attachEvent){
			var r = obj.attachEvent("on"+evType, fn);
			return r;
		} else {
			return false;
		}
	};

	/**
	 *
	 * All attributions to Scott Andrew LePera for this.
	 * http://www.scottandrew.com/weblog/articles/cbs-events
	 *
	 * @param obj The element to check
	 * @param evType The event to remove
	 * @param fn The function to that handles the event
	 * @param useCapture 
	 * @return boolean Status of event addition
	 */
	this.removeEvent = function (obj, evType, fn, useCapture){
		if (obj.length > 1) {
			for (i in obj)
				this.addEvent(obj[i], evType, fn, useCapture);
			
			return;
		}

		if (obj.removeEventListener){
			obj.removeEventListener(evType, fn, useCapture);
			return true;
		} else if (obj.detachEvent){
			var r = obj.detachEvent("on"+evType, fn);
			return r;
		} else {
			return false;
		}
	};

	this.triggerEvent = function (obj, ev, event) {
		event = event || document.createEvent('Event');
		event.initEvent(ev, true, true);
		obj.dispatchEvent(event);
	}
};
