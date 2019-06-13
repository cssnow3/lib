const fs = require('fs');
const readline = require('readline-sync');
const funcs = require('./functions.js');

const dir = 'DataBase';

if (!fs.existsSync(dir)) fs.mkdirSync(dir);
fs.appendFileSync(`./${dir}/database.txt`, '');
// fs.chmodSync('./database.txt',300);

funcs.mainMenu();

while (true) {
  funcs.pos(18, 37);
  const answer = readline.question('');
  if (answer === '1') {
    funcs.Register();
  } else if (answer === '2') {
    const flag = funcs.Login();
    if (flag === false) {
      funcs.Document();
    }
  } else if (answer === 'q') {
    process.exit(0);
  } else {
    funcs.mainMenu('Invalid input');
  }
}
