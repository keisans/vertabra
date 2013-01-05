Vertabra.register('todo', function( sb ) {
	var _public = {};

	_public.init = function(){
		Todos = new Todo.Collections.Items();
		Todos.add({name: 'Buy Milk', due: 'Tomorrow'});
		TodosListView = new Todo.Views.Items({collection: Todos});
		TodoFormView = new Todo.Views.NewItemView({collection: Todos});
		sb.append(TodoFormView.render().el);
		sb.append(TodosListView.render().el)

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
			this.collection.on('add', this.addOne, this);
		},

		render: function(){
			this.collection.each(function( item ){
				this.addOne(item);
			}, this);

			return this;
		},

		addOne: function(item){
			var itemView = new Todo.Views.Item( { model: item } );
			this.$el.append( itemView.render().el );
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

	Todo.Views.NewItemView = Backbone.View.extend({
		tagName: 'form',

		template: _.template($('#newItemForm').html()),

		events: {
			'submit': 'newItem'
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		},

		newItem: function(e) {
			e.preventDefault();
			var name = sb.find('#name');
			var due = sb.find('#due');

			this.collection.add({name: name.val(), due: due.val()});
			name.val('');
			due.val('');
		}
	});

	return _public;
});