var fs = require('fs');

function createBlogRoll(posts) {
  //create list of posts for home page
  var blogroll = [];

  // get metadata for each blog post
  for (i = 0; i < posts.length; i++) {
    var postPath = 'blog/' + posts[i];
    var postBody = fs.readFileSync(postPath, {encoding: 'utf8'});
    var postTitle = postBody.match(/<h1>(.*?)<\/h1>/)[1];
    var postDate = postBody.match(/<span class="date">(.*?)<\/span>/)[1];
    var postMeta = {
      title: postTitle,
      path: postPath,
      date: postDate,
    };
    blogroll.push(postMeta);
  }

  // sort posts and make blogroll for home page
  var indexBlog = '';
  blogroll
    .sort(function(post, previousPost) {
      return new Date(previousPost.date) - new Date(post.date);
    })
    .map(function(post) {
      indexBlog +=
        '<article><h3><a href="' +
        post.path +
        '">' +
        post.title +
        '</a></h3><span class="date">' +
        post.date +
        '</date></article>';
    });
  return indexBlog;
}

function createIndexPage(posts, template) {
  // create index page
  var indexPath = 'index.html';
  var indexBody = fs
    .readFileSync(indexPath, {encoding: 'utf8'})
    .replace('<!-- BLOG -->', createBlogRoll(posts));
  var indexHtml = template.replace('<!-- CONTENT -->', indexBody);

  // write finished home page to build folder
  fs.writeFileSync('build/' + indexPath, indexHtml, {encoding: 'utf8'});
}

function createBlogPages(posts, template) {
  // create blog posts
  for (i = 0; i < posts.length; i++) {
    // get html from posts
    var path = 'blog/' + posts[i];
    var post = fs.readFileSync(path, {encoding: 'utf8'});
    var html = template.replace('<!-- CONTENT -->', post);

    // write finished file to build folder
    fs.writeFileSync('build/' + path, html, {encoding: 'utf8'});
  }
}

// get all blog posts inside 'blog' directory
fs.readdir('blog', function(err, files) {
  if (err) throw err;

  // create directory
  fs.mkdirSync('build/blog', {recursive: true});

  // get template html
  var template = fs.readFileSync('template.html', {encoding: 'utf8'});

  createIndexPage(files, template);
  createBlogPages(files, template);
});
