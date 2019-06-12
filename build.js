const fs = require('fs');

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
const copyFolder = (source, destination) => {
  // check if current file is a folder
  if (fs.statSync(source).isDirectory()) {
    // create folder in build directory
    fs.mkdirSync(destination);

    // copy every file in directory
    fs.readdirSync(source).forEach(file => {
      copyFolder(`${source}/${file}`, `${destination}/${file}`);
    });
  } else {
    fs.copyFileSync(source, destination);
  }
};

// get template html
const template = fs.readFileSync('template.html', {encoding: 'utf8'});
const pages = [];

const getPages = folder => {
  // get all files in directory
  fs.readdirSync(folder).forEach(file => {
    const filename = `${folder}/${file}`;

    // if directory, go deeper another level
    if (fs.statSync(filename).isDirectory()) {
      getPages(filename);
      // only grab html files
    } else if (filename.indexOf('.html') > -1) {
      pages.push(filename);
    }
  });
};

const buildPages = pages => {
  pages.forEach(page => {
    const pageHtml = fs.readFileSync(page, {encoding: 'utf8'});
    const newPageHtml = template.replace('<!-- CONTENT -->', pageHtml);
    fs.writeFileSync(page, newPageHtml, {encoding: 'utf8'});
  });
};

const build = () => {
  const srcDirectory = './src';
  const buildDirectory = './build';

  // delete build folder if exists already
  if (fs.existsSync(buildDirectory)) {
    deleteFolder(buildDirectory);
  }

  copyFolder(srcDirectory, buildDirectory);
  buildPages(['./build/blog/first-post.html', './build/index.html']);
};

build();
