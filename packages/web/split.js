let MediaSplit = require('media-split');
let split = new MediaSplit({ input: 'public/Tomawari_inst.mp3', sections: ['[00:00 - 00:15] preview'] });
split.parse().then((sections) => {
  for (let section of sections) {
    console.log(section.name);      // filename
    console.log(section.start);     // section start
    console.log(section.end);       // section end
    console.log(section.trackName); // track name
  }
});