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
 * Form validation
 *
 * @package	  eightval 
 * @version	  0.2
 * @copyright Frengstad Web Teknologi	
 * @author	  Olav Frengstad <olav@fwt.no>
 * @license	  http://www.opensource.org/licenses/bsd-license.php BSD License
 */

//	Create object in global namespace
if ( typeof (Fwt) == "undefined" ) {
	Fwt = {};
}

//	Create the form objectin it does not exists
if ( typeof (Fwt.form) == "undefined" ) {
	Fwt.form =  {
		FIELD_STATUS_EMPTY : 0,
		FIELD_STATUS_ERROR : 1,
		FIELD_STATUS_OK    : 2,
		FIELD_STATUS_NONE  : 4,
		FIELD_STATUS_INIT  : 6,

		htmlform           : null,
		
		/**
		 * Validate form
		 * 
		 * @param form Form element to validate
		 * @param dom The dom helper utils
		 */
		validate           : function ( form, dom ) {
			this.htmlform = form;
			var fields = form.getElementsByTagName( 'input' );
			
			for ( var i = 0; i < fields.length; i++ ) {
				if ( (fields[i].type == 'password' || fields[i].type == 'text') && dom.hasClass( fields[i], 'validate' ) ) {
					//	Validate text field
					var field = "";

					switch (true) {
						case dom.hasClass(fields[i], 'email'):
							field = new Fwt.form.EmailTextField(fields[i]);
							break;
						case dom.hasClass(fields[i], 'password'):
							field = new Fwt.form.PasswordField(fields[i]);
							break;
						case dom.hasClass(fields[i], 'confirm-password'):
							field = new Fwt.form.PasswordConfirmationField(fields[i]);
							break;
						default:
							field = new Fwt.form.TextField(fields[i]);
							break;
					}
					
					if ( dom.hasClass( fields[i], 'required' ) ) {
						this.required = true;
					}

					//	This will be called once before everything
					field.setup(dom);
				} else if ( fields[i].type == 'submit' || fields[i].type == 'button' ) {
//					// @todo fix validation of all upon submit
//					var self = this;
//					dom.addEvent( fields[i], 'click', function() { self.validateForm(); })
				}
			}
		}
	};
}

Fwt.form.AbstractField = function ( field ) {
	/**
	 * The DOM element
	 * 
	 * @var field
	 */
	this.field = field || null;
	
	/**
	 * Messages
	 * @var msg
	 */
	this.msgEmpty   = "You are required to fill out this field";
	this.msgError   = "Validation of field failed";
	this.msgOk      = "Completed";
	this.msgNone    = "An unknown error occured";
	
	/**
	 * Flag for required fields
	 * 
	 * @var isRequired
	 */
	this.required = false;
	
	/**
	 * Defines if field has been modified
	 * 
	 * @var modified
	 */
	this.modified   = false;
	
	/**
	 * The current state of the field
	 * 
	 * @var state
	 */
	this.state      = Fwt.form.FIELD_STATUS_NONE;
	
	/**
	 * The message element corresponding to a field
	 *
	 * @var message
	 */
	this.message    = null;
	
	this.dom        = new Fwt.dom();
	
	/**
	 * @param  state The field state can be Fwt.form.FIELD_STATUS_{EMPTY,NONE,OK,ERROR}
	 * @return void
	 */
	this.setState = function ( state ) {
		if ( state == Fwt.form.FIELD_STATUS_INIT ) {
			return;
		}
	
		//	Remove current state class if any
		if ( this.state == Fwt.form.FIELD_STATUS_EMPTY ) {
			this.message && this.dom.removeClass( this.message, 'error' );
			this.message && this.dom.removeClass( this.message, 'empty' );
			this.dom.removeClass( this.field,   'error' );
		} else if ( this.state == Fwt.form.FIELD_STATUS_ERROR ) {
			this.message && this.dom.removeClass( this.message, 'error' );
			this.dom.removeClass( this.field,   'error' );
		} else if ( this.state == Fwt.form.FIELD_STATUS_NONE ) {
			this.message && this.dom.removeClass( this.message, 'validation-unknown' );
			this.dom.removeClass( this.field,   'validation-unknown' );
		}
		
		if ( state == Fwt.form.FIELD_STATUS_OK )
		{
			//	Remove any message
			if ( this.message ) {
				this.message.parentNode.removeChild( this.message );
				this.message = null;
			}
			
			this.dom.removeClass( this.field, 'error' );
			this.dom.removeClass( this.field, 'validation-unknown' );
			
			this.state = state;
			return;
		} else if ( this.message == null ) {
			this.message = this.createMessageSpan( this.field )
		}
		
		switch ( state ) {
			case Fwt.form.FIELD_STATUS_EMPTY:
				this.dom.addClass( this.message, 'error empty' );
				this.dom.addClass( this.field,   'error' );
				this.message.innerHTML = this.msgEmpty;
				break;
			case Fwt.form.FIELD_STATUS_ERROR:
				this.dom.addClass( this.message, 'error' );
				this.dom.addClass( this.field,   'error' );
				this.message.innerHTML = this.msgError;
				break;
			case Fwt.form.FIELD_STATUS_NONE:
				this.dom.addClass( this.message, 'validation-unknown' );
				this.dom.addClass( this.field,   'validation-unknown' );
				this.message.innerHTML = this.msgNone;
				break;
		}
	};
	
	this.createMessageSpan = function ( field ) {
		message = document.createElement( 'span' )
		
		this.dom.addClass( message, 'message' );
		field.parentNode.appendChild( message );
		return message;
	}
	
	/**
	 * Validate an element
	 * 
	 * Checks the element and creates error message if needed
	 * 
	 * @return boolean The status of element
	 */
	this.validate = function () {
		if ( this.field.value ) {
			this.setState( Fwt.form.FIELD_STATUS_OK );
			return true;
		}
		
		this.setState( Fwt.form.FIELD_STATUS_EMPTY )
		return false;
	};
	
	/**
	 * Setup a field and its event handlers
	 * 
	 * @param dom The dom helper utils object
	 * @return void
	 */
	this.setup = function (dom) {
		if ( dom.hasClass( this.field, 'required' ) ) {
			this.required = true;
		}

		dom.addEvent( this.field, 'blur',   this.applyValidation( this ) );
		dom.addEvent( this.field, 'click',  this.clearField( this ) );
		dom.addEvent( this.field, 'change', this.applyModification( this ) );
	};
	
	/**
	 * Accessor for applying validation rules
	 * 
	 * @return void
	 */
	this.applyValidation = function( field ) {
		return function () {
			field.validate();
		}
	};
	
	/**
	 * Set modified status for field
	 * 
	 * @return void
	 */
	this.applyModification = function ( field ) {
		return function () {
			field.modified = true;
		}
	};
	
	/**
	 * Clear any field errors
	 * 
	 * @return void
	 */
	this.clearField = function ( field ) {
		return function () {
			//	As long as we are editing we don't want to display errors
			field.setState( Fwt.form.FIELD_STATUS_OK );
		}
	};
}

/**
 * Basic text field
 * 
 * @param field The field to validate for
 * @return boolean Status of validation
 */
Fwt.form.TextField = function ( field ) {
	this.field   = field;
	this.regex   = '';
	this.pattern = null;
	
	this.validate = function () {
		if ( this.field.value ) {
			if ( this.regex != '' )
			{
				this.pattern = new RegExp(this.regex);
				
				var validated = this.pattern.test(this.field.value);
				
				if ( validated ) {
					this.setState(Fwt.form.FIELD_STATUS_OK);
				} else {
					this.setState(Fwt.form.FIELD_STATUS_ERROR);
				}
				
				return validated;
			}
			
			this.setState(Fwt.form.FIELD_STATUS_OK);
			
			return true;
		} else {
			this.setState( Fwt.form.FIELD_STATUS_EMPTY );
		}
		
		return false;
	}

}

Fwt.form.TextField.prototype = new Fwt.form.AbstractField();

/**
 * Email validation
 * 
 * @param field Field to validate against
 */
Fwt.form.EmailTextField = function ( field ) {
	this.field     = field;
	this.regex     = /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}$/i;
	this.msgError = "You are required to enter a valid email address";
	this.msgEmpty = "You are required to enter a valid email address";
}

Fwt.form.EmailTextField.prototype = new Fwt.form.TextField();

Fwt.form.PasswordField = function ( field ) {
	this.field    = field;
	this.regex    = /.{6,}/;
	this.msgError = "Password must atleast be 6 characters";
	this.msgEmpty = "You need to enter a password";
}

Fwt.form.PasswordField.prototype = new Fwt.form.TextField();


Fwt.form.PasswordConfirmationField = function ( field ) {
	this.field    = field;
	this.msgError = "Passwords did not match";
	this.msgEmpty = "You need to confirm your password";
	this.sibling  = document.getElementById('password');

	this.validate = function () {
		if ( this.field.value ) {
			if ( this.sibling.value == this.field.value ) {
				this.setState(Fwt.form.FIELD_STATUS_OK);
			} else {
				this.setState(Fwt.form.FIELD_STATUS_ERROR);
				return false;
			}
			
			return true;
		} else {
			this.setState( Fwt.form.FIELD_STATUS_EMPTY );
		}
		
		return false;
	}
}

Fwt.form.PasswordConfirmationField.prototype = new Fwt.form.AbstractField();

//	Automatically load if there are any forms on page
if ( Fwt.dom != "undefined" ) {
		dom = new Fwt.dom();
		dom.addEvent(window, 'load', function () {
			var elems = document.getElementsByTagName('form');

			for ( var i = 0; i < elems.length; i++ )
			{
				//	Sign up form for validation, this will only attach event handlers
				dom.hasClass(elems[i], 'fwt-validate') && Fwt.form.validate( elems[i], dom );
			}
		});
}