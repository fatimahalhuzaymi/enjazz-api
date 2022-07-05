import { User, Activity, Certificate, Admin} from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { ObjectId } from 'bson';
import { FastifyInstance } from 'fastify';
import Fuse from 'fuse.js';
import _ from 'lodash';
import { addAuthorization } from '../../hooks/auth';
import { prismaClient } from '../../prisma';
    

const enjaz= Type.Object({
    user_id: Type.String(),
    name: Type.String(),
    score: Type.String(),
	password: Type.String(),
	college: Type.String(),
	points: Type.String(),
	GPA: Type.String()
});

type enjaz = Static<typeof enjaz>;

const EnjazWithoutId = Type.Object({
	name: Type.String(),
	score: Type.String(),
});

type EnjazWithoutId = Static<typeof EnjazWithoutId>;

const PartialEnjaztWithoutId = Type.Partial(EnjazWithoutId);
type PartialEnjazWithoutId = Static<typeof PartialEnjaztWithoutId>;

const GetEnjazQuery = Type.Object({
	text: Type.Optional(Type.String()),
});

type GetEnjazQuery = Static<typeof GetEnjazQuery>;

const EnjazParams = Type.Object({
	user_id: Type.String(),
});

type EnjazParams = Static<typeof EnjazParams>;

//export let enjazz: enjaz[] = [
  //  { user_id: new ObjectId().toHexString(),name: 'frida', score: '500',password:'123456',college:'CS',points:'876',GPA:'3.00'},
    //{ user_id: new ObjectId().toHexString(),name: 'mariam',score: '324',password:'987653',college:'CS',points:'234',GPA:'4.22'},
    //{ user_id: new ObjectId().toHexString(),name: 'farah', score: '987',password:'654321',college:'CS',points:'321',GPA:'4.55' },
    //{ user_id: new ObjectId().toHexString(), name: 'yara', score: '432',password:'789543',college:'CS',points:'311',GPA:'3.99' },
    //{ user_id: new ObjectId().toHexString(), name: 'wafa', score: '756',password:'098123',college:'CS',points:'554',GPA:'4.25'},
//];


const   User = Type.Object({
    user_id:    Type.String(),
    password: Type.String(),
    name:     Type.String(),
    college:    Type.String(),
    points:     Type.String(),
    score:      Type.String(),
    GPA:         Type.Number(),
    email:       Type.String()
});

const Activity = Type.Object({
        activity_id:  Type.String(),
        actifity_name:   Type.String(), 
        activity_date: Type.Number(),
        activity_points: Type.String(),
        activity_place:  Type.String(),
        activity_hour: Type.Number(),
        email: Type.String()
});

const Certificate = Type.Object({
certificate_id: Type.String(), 
activity_name: Type.String(), 
activity_hour: Type.String(),
college: Type.String(),
activity_points: Type.String(),
certificate_status: Type.String(),
user_id: Type.String(),
});

const Admin = Type.Object({
    admin_id: Type.String(), 
    Password: Type.String(),
    career: Type.String(),
    college: Type.String(),
});

export default async function (server: FastifyInstance) {
	addAuthorization(server);
/*
    server.route({
        method: 'POST',
        url: '/profile',
        schema: {
            summary: 'create enjaz',
            tags: ['enjazz'],
            body: EnjazWithoutId,
        },
        handler: async (request, reply) => {
			const {User}:any = request.body as EnjazWithoutId
			return await prismaClient.user.create({
			      	data:User,
			});
		},
	});
    
    server.route({
        method: 'PUT',
        url: '/profile',
        schema: {
            summary: 'create new enjaz',
            tags: ['enjazz'],
            body: enjaz,
            },
            handler: async (request, reply) => {
                const enjaz = request.body as any;
                if (!ObjectId.isValid(Activity.activity_id)) {
                    reply.badRequest('activity_id should be an ObjectId!');
                } else {
                    return await prismaClient.activity.upsert({
                        where: { activity_id: Activity.activity_id },
                        create: enjaz,
                        update: _.omit(enjaz, ['activity_id']),
                    });
                }
            },
        });
    */
    
    server.route({
        method: 'PATCH',
        url: '/profile/:user_id',
        schema: {
            summary: 'Update a enjaz by id',
            tags: ['enjazz'],
            body: EnjazWithoutId,
            params: EnjazParams,
                
            },
            handler: async (request, reply) => {
                const { user_id } = request.params as EnjazParams;
                if (!ObjectId.isValid(user_id)) {
                    reply.badRequest('user_id should be an ObjectId');
                    return;
                }
    
                const enjaz = request.body as PartialEnjazWithoutId;
    
                return prismaClient.activity.update({
                    where: { activity_id:user_id },
                    data: Activity,
                });
            },
        });
     

    server.route({
        method: 'DELETE',
        url: '/profile/:user_id',
        schema: {
            summary: 'Deletes a enjaz',
            tags: ['enjazz'],
            params: EnjazParams,
        },
        handler: async (request, reply) => {
			const { user_id } = request.params as EnjazParams;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
				return;
			}
			return prismaClient.activity.delete({
				where: { activity_id :user_id},
			});
		},
	});

    server.route({
        method: 'GET',
        url: '/profile/:user_id',
        schema: {
            summary: 'Returns one enjaz or null',
            tags: ['enjazz'],
            params: EnjazParams,
            response: {
                '2xx': Type.Union([enjaz, Type.Null()]),
            },
        },
        handler: async (request, reply) => {
			const { user_id } = request.params as EnjazParams;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
				return;
			}

			return prismaClient.activity.findFirst({
				where: { activity_id :user_id},
			});
		},
	});
}