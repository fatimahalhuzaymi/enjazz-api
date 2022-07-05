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
	certificate_status: Type.String(),
    email: Type.String()
});
const CertificateWithoutId = Type.Object({
	Certificate_id: Type.String(),
	activity_name: Type.String(),
	activity_point: Type.String(),
	activity_hour: Type.String(),
	college: Type.String(),
	activity_points: Type.String(),
	certificate_status: Type.String(),
	email: Type.String()
});

type CertificateWithoutId = Static<typeof CertificateWithoutId>;

const PartialCertificateWithoutId = Type.Partial(CertificateWithoutId);
type PartialCertificateWithoutId = Static<typeof PartialCertificateWithoutId>;

const GetCertificateQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetCertificateQuery = Static<typeof GetCertificateQuery>;

const CertificateParams = Type.Object({
	contact_id: Type.String(),
});
type CertificateParams = Static<typeof CertificateParams>;

const Certificatee= Type.Object({
	certificate_id: Type.String(),
	activity_name: Type.String(),
	activity_hour: Type.String(),
	college: Type.String(),
	activity_points: Type.String(),
	certificate_status: Type.String()
  });
  


  export default async function (server: FastifyInstance) {
	addAuthorization(server);

	/// Create 
	server.route({
		method: 'POST',
		url: '/certificate_upload',
		schema: {
			summary: 'Creates new certificate upload',
			tags: ['Certificate'],
			body: CertificateWithoutId,
		},
		handler: async (request, reply) => {
			const certificate = request.body as any;
			return await prismaClient.certificate.create({
				data: certificate,
			});
		},
	});


   

/// Get all certifictes or search by name
server.route({
	method: 'GET',
	url: '/certificate_upload',
	schema: {
		summary: 'Gets all Certificate',
		tags: ['Certificate'],
		querystring: GetCertificateQuery,
		response: {
			'2xx': Type.Array(Certificate),
		},
	},
	handler: async (request, reply) => {
		const query = request.query as GetCertificateQuery;

		const Certificates = await prismaClient.certificate.findMany();
		if (!query.text) return Certificates;

		const fuse = new Fuse(Certificates, {
			includeScore: true,
			isCaseSensitive: false,
			includeMatches: true,
			findAllMatches: true,
			threshold: 1,
			keys: ['activity', 'user_id'],
		});

		console.log(JSON.stringify(fuse.search(query.text)));

		const result: Certificate[] = fuse.search(query.text).map((r) => r.item);
		return result;
	},
});
  }
