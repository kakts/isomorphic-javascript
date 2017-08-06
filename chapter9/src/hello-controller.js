import Controller from './lib/controller';
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

export default class HelloController extends Controller {
  toString(callback) {
    nunjucks.renderString('hello.html', getName(this.context), (err, html) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, html);
    });
  }
  index(application, request, reply, callback) {
    this.context.cookie.set('random', '_' + (Math.floor(Math.random() * 1000) + 1), {path: '/'});
    callback(null);
  }
}
