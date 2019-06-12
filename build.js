const fs = require('fs');

const srcDirectory = './src';
const buildDirectory = './build';

// if build directory already exists, delete it
const deleteFolder = folder => {
  // get every file in folder
  fs.readdirSync(folder).forEach(file => {
    // get current folder/file
    const filename = `${folder}/${file}`;

    // check if we need to go deeper
    if (fs.statSync(filename).isDirectory()) {
      deleteFolder(filename);
    } else {
      // else, delete file
      fs.unlinkSync(filename);
    }
  });

  // finally, delete current folder
  fs.rmdirSync(folder);
};

// copy src to build before we build out the pages/posts
const buildFolder = (source, destination) => {
  // check if current file is a folder
  if (fs.statSync(source).isDirectory()) {
    // create folder in build directory
    fs.mkdirSync(destination);

    // copy every file in directory
    fs.readdirSync(source).forEach(file => {
      buildFolder(`${source}/${file}`, `${destination}/${file}`);
    });
    // if it's a page . . .
  } else if (source.indexOf('.html') > -1) {
    buildPage(source, destination);
    // if other file, jusy copy it
  } else {
    fs.copyFileSync(source, destination);
  }
};

const createBlogRoll = () => {
  //create list of posts for home page
  const blogroll = [];

  // get metadata for each blog post
  fs.readdirSync(`${srcDirectory}/blog/`).forEach(post => {
    const filename = `${srcDirectory}/blog/${post}`;
    const relativeFilename = `blog/${post}`;
    const postHtml = fs.readFileSync(filename, {encoding: 'utf8'});
    const postTitle = postHtml.match(/<h1>(.*?)<\/h1>/)[1];
    const postDate = postHtml.match(/<span class="date">(.*?)<\/span>/)[1];
    const postMeta = {
      title: postTitle,
      path: relativeFilename,
      date: postDate,
    };
    blogroll.push(postMeta);
  });

  return blogroll;
  console.log(blogroll);
};

// get template html
const template = fs.readFileSync('template.html', {encoding: 'utf8'});

const buildPage = (source, destination) => {
  const pageHtml = fs.readFileSync(source, {encoding: 'utf8'});
  const newPageHtml = template.replace('<!-- CONTENT -->', pageHtml);
  fs.writeFileSync(destination, newPageHtml, {encoding: 'utf8'});
};

const build = () => {
  // delete build folder if exists already
  if (fs.existsSync(buildDirectory)) {
    deleteFolder(buildDirectory);
  }

  buildFolder(srcDirectory, buildDirectory);
};

// build();
createBlogRoll();
