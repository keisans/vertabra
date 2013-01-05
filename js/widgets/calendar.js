Vertabra.register('calendar', function( sb ) {
	var _public = {};

	_public.init = function(){
		sb.on('itemClick', function(){
			sb.log(1, 'something darkside');
		}, this);

		sb.trigger( 'calendarStart' );
	};

	_public.destroy = function(){
		sb.off('itemClick')

		sb.trigger( 'calendarEnd' );
	};

	return _public;
});