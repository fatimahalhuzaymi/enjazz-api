import { User, Activity, Certificate, Admin} from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { ObjectId } from 'bson';
import { FastifyInstance } from 'fastify';
import Fuse from 'fuse.js';
import _ from 'lodash';
import { addAuthorization } from '../../hooks/auth';
import { prismaClient } from '../../prisma';
    
const reg_act = Type.Object({
	user_id: Type.String(),
	name: Type.String(),
	email: Type.String({format:'email'})
	
    
});
const RegWithoutId = Type.Object({
	name: Type.String(),
	phone: Type.String(),
});
type reg_act = Static<typeof reg_act>;
type RegWithoutId = Static<typeof RegWithoutId>;

const PartialRegWithoutId= Type.Partial(RegWithoutId);
type PartialRegWithoutId = Static<typeof PartialRegWithoutId >

const GetRegQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetRegQuery = Static<typeof GetRegQuery>;

const RegParams = Type.Object({
	contact_id: Type.String(),
});
type ContactParams = Static<typeof RegParams>;

export let register: reg_act[] = [
	{ user_id:new ObjectId().toHexString(),email:'436004567@pnu.edu.sa' ,name: 'frida alhadi'},
	{ user_id:new ObjectId().toHexString(),email:'439004567@pnu.edu.sa',name: 'suha almajed'},
	{ user_id:new ObjectId().toHexString(),email:'440004567@pnu.edu.sa',name:'seba alfozan'},
	{ user_id:new ObjectId().toHexString(),email:'442004567@pnu.edu.sa' ,name: 'sama alrajhi'},
	{ user_id:new ObjectId().toHexString(),email:'442004567@pnu.edu.sa' ,name: 'nour alzid'}
	
];
const   User = Type.Object({
    user_id:    Type.String(),
    password: Type.String(),
    name:     Type.String(),
    college:    Type.String(),
    points:     Type.String(),
    score:      Type.String(),
    GPA:         Type.Number(),
});

const Activity = Type.Object({
        activity_id:  Type.String(),
        actifity_name:   Type.String(), 
        activity_date: Type.Number(),
        activity_points: Type.String(),
        place:  Type.String(),
        activity_hour: Type.Number(),
		email : Type.String()
});

const Certificate = Type.Object({
certificate_id: Type.String(), 
activity_name: Type.String(), 
activity_hour: Type.String(),
college: Type.String(),
activity_points: Type.String(),
certificate_status: Type.String(),
user_id: Type.String(),
email : Type.String()
});

const Admin = Type.Object({
    admin_id: Type.String(), 
    Password: Type.String(),
    career: Type.String(),
    college: Type.String(),
});



	export default async function (server: FastifyInstance) {
		addAuthorization(server);
	server.route({
		method: 'PUT',
		url: '/register_for_activities',
		schema: {
			summary: 'Updates or insets a reg',
			tags: ['register_for_activity'],
			body: reg_act,
		},
		handler: async (request, reply) => {
			const reg_act1 = request.body as any;
			if (!ObjectId.isValid(reg_act.user_id)) {
				reply.badRequest('contact_id should be an ObjectId!');
			} else {
				return await prismaClient.activity.upsert({
					where: { activity_id: Activity.activity_id},
					create: reg_act1,
					update: _.omit(reg_act1, ['user_id']),
				});
			}
		},
	});

	
  
	server.route({
		method: 'DELETE',
		url: '/register_for_activities/:id',
		schema: {
			summary: 'Deletes a reg',
			tags: ['register_for_activity'],
            params: RegParams,
            
		},
		handler: async (request, reply) => {
			const { user_id } = request.params as any;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
				return;
			}

			return prismaClient.activity.delete({
				where: { activity_id:user_id },
			});
		},
	});
	


	server.route({
		method: 'GET',
		url: '/register_for_activities',
		schema: {
			summary: 'Gets all registers',
			tags: ['register_for_activity'],
            params: RegParams,

			response: {
				'2xx': Type.Union([reg_act, Type.Null()]),	
				},
		},

		handler: async (request, reply) => {
			const { user_id } = request.params as any;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
				return;
			}

			return prismaClient.activity.findFirst({
				where: { activity_id:user_id },
			});
		},
	});

	/// Get all reg or search by name
	server.route({
		method: 'GET',
		url: '/register_for_activity',
		schema: {
			summary: 'Gets all activity',
			tags: ['register_for_activity'],
			querystring: GetRegQuery,
			response: {
				'2xx': Type.Array(reg_act),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetRegQuery;

			const reg = await prismaClient.activity.findMany();
			if (!query.text) return register;

			const fuse = new Fuse(register, {
				includeScore: true,
				isCaseSensitive: false,
				includeMatches: true,
				findAllMatches: true,
				threshold: 1,
				keys: ['name'],
			});

			console.log(JSON.stringify(fuse.search(query.text)));

			const result: reg_act[] = fuse.search(query.text).map((r) => r.item);
			return result;
		},
	});
	}