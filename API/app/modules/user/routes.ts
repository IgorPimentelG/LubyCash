import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.group(() => {
		Route.post('/forgot-password', 'ForgotPasswordsController.store');
		Route.put('/reset-password/:token', 'ForgotPasswordsController.update');
	}).prefix('/v1/user');
}).prefix('/api');
