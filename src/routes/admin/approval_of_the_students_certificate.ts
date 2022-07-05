import { Activity, Certificate, User, Admin } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { ObjectId } from 'bson';
import { FastifyInstance } from 'fastify';
import Fuse from 'fuse.js';
import _ from 'lodash';
import { addAuthorization } from '../../hooks/auth';
import { prismaClient } from '../../prisma';

const Certificate= Type.Object({
	certificate_id: Type.String(),
	activity_name: Type.String(),
	activity_hour: Type.String(),
	college: Type.String(),
	activity_points: Type.String(),
	certificate_status: Type.String()

});
const CertificateWithoutId = Type.Object({
	activity_name: Type.String(),
	activity_hour: Type.String(),
	college: Type.String(),
	activity_points: Type.String(),
	certificate_status: Type.String()
});

type CertificateWithoutId = Static<typeof CertificateWithoutId>;

const PartialCertificateWithoutId = Type.Partial(CertificateWithoutId);
type PartialCertificateWithoutId = Static<typeof PartialCertificateWithoutId>;

const GetCertificateQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetCertificateQuery = Static<typeof GetCertificateQuery>;

const CertificateParams = Type.Object({
	activity_id: Type.String(),
});
type CertificateParams = Static<typeof CertificateParams>;

/*
export let certificates: Certificate[] = [
	{user_id: new ObjectId().toHexString(), activity_name: 'ui/ux', college: 'CS',activity_point:'100' },
	{ user_id: new ObjectId().toHexString(), activity_name: 'java Programming language course',college: 'tl',activity_point:'100'},
	{user_id: new ObjectId().toHexString(), activity_name: 'paython Programming language course', college: 'CS',activity_point:'100'},
	{ user_id: new ObjectId().toHexString(), activity_name: 'C Programming language course', college: 'CS',activity_point:'100'},
	{ user_id: new ObjectId().toHexString(), activity_name: 'C++ Programming language course',college: 'CS', activity_point:'100' },
	
];
*/
const Certificatee= Type.Object({
	certificate_id: Type.String(),
	activity_name: Type.String(),
	activity_hour: Type.Number(),
	college: Type.String(),
	activity_points: Type.String(),
	certificate_status: Type.String()
  });
  


  export default async function (server: FastifyInstance) {
	addAuthorization(server);

	/// Create 
	server.route({
		method: 'POST',
		url: '/approval_of_student_certificate',
		schema: {
			summary: 'Creates new certificate upload',
			tags: ['approval_of_student_certificate'],
			body: CertificateWithoutId,
		},
		handler: async (request, reply) => {
			const certificate = request.body as any;
			return await prismaClient.certificate.create({
				data: certificate,
			});
		},
	});
  }