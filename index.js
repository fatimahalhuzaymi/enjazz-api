import {server} from './server';

const server = fastify({logger:true});

server.get('/',async(request,reply)=>{
    return{hi: 'enjaz!!'};
});
server.get('/registrationlist',async(request,reply)=>{
const registrationlist = ['programing course','college club','volunteering'];

return registrationlist;

});

server.listen({port:3000}).catch((err)=>{
server.log.error(err);
process.exit(1);
});