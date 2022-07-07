import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.group(() => {
		Route.post('/create', 'AdminsController.store');
		Route.put('/update/:uuid', 'AdminsController.update');
		Route.get('/list', 'AdminsController.show');
		Route.delete('/delete/:uuid', 'AdminsController.destroy');
	}).prefix('/v1/admin');
})
	.prefix('/api')
	.middleware(['auth', 'adminOnly']);
