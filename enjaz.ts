import { FastifyInstance } from 'fastify';
import { upsertenjazController } from '../controllers/upsert-enjaz';

export let enjaz: any[] = [
	{ id: 1, name: 'maha', score: '1000' },
	{ id: 2, name: 'mona', score: '600' },
	{ id: 3, name: 'suha', score: '300' },
];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/enjaz/upsert',
		schema: {
			summary: 'Updates or insets a enjaz',
			tags: ['Enjaz'],
			body: {},
		},
		handler: async (request, reply) => {
			const newEnjaz: any = request.body;
			return upsertenjazController(enjaz, newEnjaz);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/enjaz/:id',
		schema: {
			summary: 'Deletes a enjaz',
			tags: ['Enjaz'],
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			enjaz = enjaz.filter((c) => c.id !== +id);

			return enjaz;
		},
	});

	server.route({
		method: 'GET',
		url: '/enjaz',
		schema: {
			summary: 'Gets all enjaz',
			tags: ['Enjaz'],
		},
		handler: async (request, reply) => {
			return enjaz;
		},
	});
}