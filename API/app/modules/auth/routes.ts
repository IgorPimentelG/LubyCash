import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.group(() => {
		Route.post('/admin/sign-in', 'AuthController.authenticate');
	}).prefix('/v1');
}).prefix('/api');
