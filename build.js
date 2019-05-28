var fs = require('fs');

// get all blog posts inside 'blog' directory
fs.readdir('blog', function(err, files) {
  if (err) throw err;

  fs.mkdirSync('build/blog', {recursive: true});

  // get template html
  var template = fs.readFileSync('template.html', {encoding: 'utf8'});

  // create blog posts
  for (i = 0; i < files.length; i++) {
    // get html from files
    var path = 'blog/' + files[i];
    var post = fs.readFileSync(path, {encoding: 'utf8'});
    var html = template.replace('<!-- CONTENT -->', post);

    // write finished file to build folder
    fs.writeFileSync('build/' + path, html, {encoding: 'utf8'});
  }
});
