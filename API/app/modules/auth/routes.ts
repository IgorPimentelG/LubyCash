import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.group(() => {
		Route.post('/sign-in', 'AuthController.authenticateAdmin');
	}).prefix('/v1/admin');

	Route.group(() => {
		Route.post('/sign-in', 'AuthController.authenticateClient');
	}).prefix('/v1/client');
}).prefix('/api');
