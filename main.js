const fs = require('fs');
const readline = require('readline-sync');
const funcs = require('./functions.js');

const dir = 'DataBase';

if (!fs.existsSync(dir)) fs.mkdirSync(dir);
fs.appendFileSync(`./${dir}/database.txt`, '');

funcs.mainMenu();

while (true) {
  funcs.pos(18, 37);
  const answer = readline.question('');
  if (answer === '1') {
    funcs.register();
  } else if (answer === '2') {
    const unavailable = funcs.loginfunc();
    if (unavailable === false) {
      funcs.document();
    }
  } else if (answer === 'q') {
    process.exit(0);
  } else {
    funcs.mainMenu('Invalid input');
  }
}
