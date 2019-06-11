const path = require('path');
const fs = require('fs');

// if build directory already exists, delete it
const deleteFolder = folder => {
  // get every file in folder
  fs.readdirSync(folder).forEach(file => {
    // get current folder
    const currentFile = `${folder}/${file}`;

    // check if we need to go deeper
    if (fs.statSync(currentFile).isDirectory()) {
      deleteFolder(currentFile);
    } else {
      // else, delete file
      fs.unlinkSync(currentFile);
    }
  });

  // finally, delete current folder
  fs.rmdirSync(folder);
};

const copyFolder = (source, destination) => {
  // check if current file is a folder
  if (fs.statSync(source).isDirectory()) {
    // create folder in build directory
    fs.mkdirSync(destination);

    // copy every file in directory
    fs.readdirSync(source).forEach(file => {
      copyFolder(path.join(source, file), path.join(destination, file));
    });
  } else {
    fs.linkSync(source, destination);
  }
};

const build = () => {
  const srcDirectory = './src';
  const buildDirectory = './build';

  // delete build folder if exists already
  if (fs.existsSync(buildDirectory)) {
    deleteFolder(buildDirectory);
  }

  copyFolder(srcDirectory, buildDirectory);
};

function getPages(directory) {
  // get all files in directory
  var files = fs.readdirSync(directory);

  for (var i = 1; i < files.length; i++) {
    var filename = path.join(directory, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      getPages(filename); //recurse
    } else if (filename.indexOf('.html')) {
      //      pages.push(filename);
    }
  }
}

build();
