import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.group(() => {
		Route.post('/pix', 'BanksController.pix');
		Route.post('/deposit', 'BanksController.deposit');
		Route.post('/withdraw', 'BanksController.widthdraw');
	})
		.prefix('/v1/bank')
		.middleware('clientOnly');
})
	.prefix('/api')
	.middleware('auth:client_api');

Route.group(() => {
	Route.group(() => {
		Route.get('/extracts', 'BanksController.extracts');
	})
		.prefix('/v1/bank')
		.middleware('adminOnly');
})
	.prefix('/api')
	.middleware('auth:admin_api');
