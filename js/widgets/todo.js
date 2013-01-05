Vertabra.register('todo', function( sb ) {
	var _public = {};

	_public.init = function(){
		Todos = new Todo.Collections.Items();
		Todos.add({name: 'Buy Milk', due: 'Tomorrow'});
		TodosListView = new Todo.Views.Items({collection: Todos});
		sb.append(TodosListView.render().el);

		sb.trigger('todoStart')
	};

	_public.destroy = function(){
		sb.trigger('todoEnd');
	};

	var Todo = {
		Models: {},
		Collections: {},
		Views: {},
		Router: {},
		Helpers: {}
	};

	Todo.Models.Item = Backbone.Model.extend({
		/**
		 * Schema:
		 * name {str} The name of the item
		 * due {str} The due date for completion of the item
		 */
		
		validate: function(attrs){
			if(!attrs.name || !attrs.due){
				return 'A todo item requires a name and due date';
			}
		}
	});

	Todo.Collections.Items = Backbone.Collection.extend({
		model: Todo.Models.Item
	});

	Todo.Views.Items = Backbone.View.extend({
		tagName: 'ul',

		initialize: function(){
			_.bindAll(this, 'render');
		},

		render: function(){
			this.collection.each(function( item ){
				var itemView = new Todo.Views.Item( { model: item } );
				this.$el.append( itemView.render().el );
			}, this);

			return this;
		}

	});

	Todo.Views.Item = Backbone.View.extend({
		tagName: 'li',

		template: _.template('<%= name %> -- <%= due %>'),

		events: {
			'click': 'clicker'
		},

		initialize: function(){
			_.bindAll(this, 'render');
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		clicker: function(){
			sb.trigger('itemClick');
		}

	});

	return _public;
});