import { Server } from 'http';
import { req } from 'pino-std-serializers';
import { server } from './server';
//export function addLoginRoutes (server: FastifyInstance){


server.get('/login',async(request,reply)=>{
req.send({msg:'you are logged in'});

});
//addLoginRoutes(server);
//}