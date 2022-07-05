import { FastifyInstance } from 'fastify';

export default async function (server: FastifyInstance) {
	server.get('/logout', async (request, reply) => {
		return 'Logeed out ';
	});

	server.get('/verify', async (request, reply) => {
		return 'Logeed out';
	});
}