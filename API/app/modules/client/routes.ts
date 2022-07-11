import Route from '@ioc:Adonis/Core/Route';

// Public
Route.group(() => {
	Route.group(() => {
		Route.post('/request-account', 'ClientsController.store');
	}).prefix('/v1/client');
}).prefix('/api');

