var Vertabra = (function(){
	// Keep a reference to the root object
	var root = this;

	var _public = {},
		moduleData = {},
		debug = true;

	var _ = root._;

	var toStr = function ( object ) {
		return Object.prototype.toString.call( object );
	}

	var startOne = function ( moduleId, context ) {
		var module = moduleData[moduleId];

		if ( module ) {
			module.instance = module.create(Sandbox.create(context, moduleId));
			module.instance.init();
			return true;
		} else {
			return false;
		}
	};

	var stopOne = function ( moduleId, context ) {
		var data = moduleData[moduleId];
		if ( data && data.instance ) {
			data.instance.destroy();
			data.instance = null;
			return true;
		} else {
			return false;
		}
	};

	var triggerEvents = function ( obj, events, args ) {
		var ev, i = -1, l = events.length;

		switch ( args.length ) {
			case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx);
			return;
			case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0]);
			return;
			case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1]);
			return;
			case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1], args[2]);
			return;
			default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
		}
	};

	_public.register = function ( moduleId, constructor ) {
		var temp;
		if ( typeof moduleId === 'string' && typeof constructor === 'function' ) {
			temp = constructor( Sandbox.create( this, moduleId ) );
			if ( temp.init && typeof temp.init === 'function' && temp.destroy && typeof temp.destroy === 'function' ) {
				temp = null;
				moduleData[moduleId] = {
					create: constructor,
					instance: null
				};
			} else {
				this.log( 1, 'Module ' + moduleId + ' Registraion : FAILED : instance has no init or destroy function' );
			}
		} else {
			this.log( 1, 'Module Registration : FAILED : module arguments are not of correct type' );
		}
	};

	_public.start = function ( modules ) {
		var mod,
			that = this;
		
		// Make sure the module ID is a string
		if ( typeof modules === 'string' ) {
			mod = [modules];
		} else if( toStr(modules) === '[object Array]' ) {
			mod = modules;
		} else {
			this.log( 1, 'Start Module : FAILED : Modules argument must be a string or an array' );
		}

		// If the desired module actually exists
		_.each(mod, function(m){
			if ( !startOne(m, that) ){
				that.log( 1, 'Start Module ' + m + ' : FAILED : This module has not been registered' );
			}
		});
	};

	_public.stop = function ( modules ) {
		var mod;
		// Make sure the module ID is a string
		if ( typeof modules === 'string' ) {
			mod = [modules];
		} else if( toStr(modules) === '[object Array]' ) {
			mod = modules;
		} else {
			this.log( 1, 'Stop Module : FAILED : Module argument must be a string or an array' );
		}

		// If the desired module actually exists
		_.each(mod, function(m){
			if ( !stopOne(m) ){
				this.log( 1, 'Stop Module ' + m + ' : FAILED : This module has not been registered' );
			}
		});
	};

	_public.on = function ( name, callback, context ) {
		this._events || ( this._events = {} );
		var list = this._events[name] || (this._events[name] = []);
		list.push( { callback: callback, context: context, ctx: context || this } );
		return this;
	}

	_public.off = function ( name, callback, context ) {
		var list, ev, events, name, i, l, j, k;
		if (!this._events) return this;
		if(!name && !callback && !context){
			this._events = {};
			return this;
		}

		names = name ? [name] : _.keys(this._events);
		for ( i = 0, l = names.length; i < l; i += 1) {
			name = names[i];
			if ( list = this._events[name] ) {
				events = [];
				if ( callback || context ) {
					for ( j = 0, k = list.length; j < k; j += 1) {
						ev = list[j];
						if ((callback && callback !== (ev.callback._callback || ev.callback)) || (context && context !== ev.context)) {
							events.push(ev);
						}
					}
				}
				this._events[name] = events;
			}
		}
		return this;
	};

	_public.trigger = function ( name ) {
		if (!this._events) return this;
		var args = [].slice.call( arguments, 1 );
		var events = this._events[name];
		var allEvents = this._events.all;
		if(events) triggerEvents(this, events, args);
		if (allEvents) triggerEvents(this, allEvents, arguments);
		return this;
	}

	_public.bind = _public.on;
	_public.unbind = _public.off;



	_public.log = function( severity, message ) {
		if ( debug ) {
			console [ (severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error' ](message);
		} else {
			// Send to server
		}
	}

	_public.$ = function ( selector ) {
		return $( selector );
	};

	return _public;
}());