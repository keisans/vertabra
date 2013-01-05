var Sandbox = {
	create: function(core, module_selector){
		
		var CONTAINER = core.$('#' + module_selector);
		
		return {
			on: function(event, callback, context){
				core.bind(event, callback, context);
			},

			off: function(event, callback, context){
				core.unbind(event, callback, context);
			},

			trigger: function(event){
				core.trigger(event)
			},

			find: function(selector){
				CONTAINER.find(selector);
			},

			log: function(priority, message){
				core.log(priority, message);
			}

		}
	}
}