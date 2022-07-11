const express = require('express');
const { findByStatus } = require('../database');

const routes = express.Router();

routes.get('/api/v1/client-review/status/:cpf_number', async (req, res) => {
	try {
		const { cpf_number } = req.params;
		const data = await findByStatus(cpf_number);
		return res.send({ user: data });
	} catch {
		return res.status(404).json({ message: 'Usuário não encontrado! '});
	}
});


module.exports = routes;
