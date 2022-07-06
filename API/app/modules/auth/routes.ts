import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.group(() => {
		Route.post('/sign-in', 'AuthController.authenticate');
	}).prefix('/v1/admin');
}).prefix('/api');
