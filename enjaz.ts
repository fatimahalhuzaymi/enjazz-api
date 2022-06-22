import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
//import { upsertenjazController } from '../controllers/upsert-enjaz';


const enjazz = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
    score: Type.String(),
});
type enjazz = Static<typeof enjazz>;

const GetEnjazzQuery = Type.Object({
	name: Type.Optional(Type.String()),
});
type GetEnjazzQuery = Static<typeof GetEnjazzQuery>;

export let enjaz: enjazz[] = [
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa1', name: 'frida', score: '500' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', name: 'mariam',score: '700' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', name: 'farah', score: '44' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa4', name: 'yara', score: '1000' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa5', name: 'wafa', score: '564' },
	
];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/enjaz/upsert',
		schema: {
			summary: 'Updates or insets a enjaz',
			tags: ['Enjaz'],
			body: enjaz,
		},
		handler: async (request, reply) => {
			const newEnjaz: any = request.body;
			return upsertenjazController(enjaz, newEnjaz);
		},
	});
   
    server.route({
		method: 'PATCH',
		url: '/enjaz/:id',
		schema: {
			summary: 'Update a contact by id + you dont need to pass all properties',
			tags: ['enjaz'],
			body: Type.Partial(enjazz),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
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
            params: Type.Object({
                id: Type.String({
                    format: 'uuid' })
            })
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			enjaz = enjazz.filter((c: { id: string; }) => c.id !== id);

			return enjazz;
		},
	});

	server.route({
		method: 'GET',
		url: '/enjaz',
		schema: {
			summary: 'Gets all enjaz',
			tags: ['Enjaz'],
            params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([enjazz, Type.Null()]),
			},
		},
		
		handler: async (request, reply) => {
			const query = request.query as GetEnjazzQuery;

			if (query.name) {
				return enjazz.filter((c: { name: string | string[]; }) => c.name.includes(query.name ?? ''));
			} else {
				return enjazz;
			}
		},
	});
}

function upsertenjazController(enjaz: { id: string; name: string; score: string; }[], newEnjaz: any): unknown {
    throw new Error('Function not implemented.');
}
