import { User, Activity, Certificate, Admin} from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { ObjectId } from 'bson';
import { FastifyInstance } from 'fastify';
import Fuse from 'fuse.js';
import _ from 'lodash';
import { addAuthorization } from '../../hooks/auth';
import { prismaClient } from '../../prisma';

const activity = Type.Object({
    activity_id:Type.String(),
	activity_name: Type.String(),
	activity_date: Type.String(),
	activity_place:Type.String(),
	activity_hour:Type.String(),
	activity_points:Type.String()
    

	
});

const attachActivitiesWithoutId = Type.Object({
	activity_name: Type.String(),
	activity_points: Type.String(),
});
type attachActivitiesWithoutId = Static<typeof attachActivitiesWithoutId>;

const PartialattachActivitiesWithoutId = Type.Partial(attachActivitiesWithoutId);
type PartialattachActivitiesWithoutId = Static<typeof PartialattachActivitiesWithoutId>;

const GetActivitiesQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetContactsQuery = Static<typeof GetActivitiesQuery>;

const GetActivitiesParams = Type.Object({
	contact_id: Type.String(),
});
type GetActivitiesParams = Static<typeof GetActivitiesParams>;
/*
export let activites: activity[] = [
	{ activity_name:'java Programming language course'},
	{ activity_name:'C Programming language course' },
	{ activity_name:'C++ Programming language course'},
	{ activity_name:' html course'},
	{ activity_name:'PHP course'}
];
*/
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
        activity_place:  Type.String(),
        activity_hour: Type.Number(),
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
	server.route({
		
			method: 'PUT',
			url: '/attachActivities',
			schema: {
				summary: 'Creates new activities +',
				tags: ['Attach Activities'],
				body: activity,
			},
			handler: async (request, reply) => {
				const activity = request.body as Activity;
					return await prismaClient.activity.upsert({
						where: { activity_id: activity.activity_id??undefined },
						create: activity,
						update: _.omit(activity, ['activity_id']),
					});
			},
		});
	
		server.route({
			method: 'DELETE',
			url: '/attachActivities/:activity_id',
			schema: {
				summary: 'Deletes a activitities',
				tags: ['Attach Activities'],
				params: GetActivitiesParams,
			},
			handler: async (request, reply) => {
				const { activity_id } = request.params as any;
				if (!ObjectId.isValid(activity_id)) {
					reply.badRequest('activity_id should be an ObjectId!');
					return;
				}
	
				return prismaClient.activity.delete({
					where: { activity_id },
				});
			},
		});
	
	}


	