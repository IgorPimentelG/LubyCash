import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.group(() => {
		Route.post('/pix', 'BanksController.pix');
	})
		.prefix('/v1/bank')
		.middleware('clientOnly');
})
	.prefix('/api')
	.middleware('auth:client_api');
