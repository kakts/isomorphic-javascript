import Hapi from 'hapi';
import nunjucks from 'nunjucks';

nunjucks.configure('./dist');


function getName(request) {
  let name = {
    fname: 'Rick',
    lname: 'Sanchez'
  };

  let nameParts = request.params.name ? request.params.name.split('/') : [];

  name.fname = (nameParts[0] || request.query.fname) || name.fname;
  name.lname = (nameParts[1] || request.query.lname) || name.lname;
  return name;
}

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

server.route({
  method: 'GET',
  path: '/hello/{name*}',
  handler: function(request, reply) {
    nunjucks.render('index.html', getName(request), function(err, html) {
      reply(html);
    });
  }
});

server.start();
