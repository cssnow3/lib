const fs = require('fs');
const readline = require('readline-sync');

let glogin;
const gdir = 'DataBase';

const write = s => process.stdout.write(s);

const clear = () => write('\x1Bc');

const pos = (row, col) => write(`\x1b[${row};${col}H`);

function deserialize(content) {
  let str = `[${content}]`;
  const strarray = str.split('');
  strarray.splice(str.length - 2, 1);
  str = strarray.join('');
  const array = JSON.parse(str);
  return array;
}

function check(info, database, type) {
  for (let i = 0; i < database.length; i += 1) {
    const object = database[i];
    let val = null;
    if (type === 'login') {
      val = object.login;
    } else if (type === 'password') {
      val = object.password;
    }
    if (info === val) {
      return true;
    }
  }
  return false;
}

const box = (row, col, height, width) => {
  const h = height - 2;
  const w = width - 2;
  const border = '┌┐─│└┘'.split('');
  pos(row, col);
  write(border[0] + border[2].repeat(w) + border[1]);
  for (let i = 1; i < h; i += 1) {
    pos(row + i, col);
    write(border[3] + ' '.repeat(w) + border[3]);
  }
  pos(row + h, col);
  write(border[4] + border[2].repeat(w) + border[5]);
};

const documentMenu = (message = '') => {
  clear();
  pos(22, 1);
  console.log(message);

  pos(1, 35);
  write('Welcome!!!');

  box(5, 10, 4, 20);
  pos(6, 11);
  write('1.Create/Edit file');

  box(5, 30, 4, 20);
  pos(6, 31);
  write('2.Open file');

  box(5, 50, 4, 20);
  pos(6, 51);
  write('3.Delete file');

  box(8, 50, 4, 20);
  pos(9, 51);
  write('l.List');

  box(11, 50, 4, 20);
  pos(12, 51);
  write('q.Quit');
};

const mainMenu = (message = '') => {
  clear();

  pos(22, 1);
  console.log(message);

  box(7, 18, 4, 14);
  pos(8, 19);
  write(' 1.Register');

  box(7, 50, 4, 12);
  pos(8, 51);
  write(' 2.Login');

  box(1, 68, 4, 12);
  pos(2, 69);
  write(' q.Quit');
};

const updateinterface = (message = '') => {
  clear();
  pos(22, 1);
  console.log(message);
  box(10, 28, 4, 25);
  box(1, 68, 4, 12);
  pos(2, 69);
  write(' q.Quit');
};

function RegisterLogin(bool, quitbool, user) {
  pos(11, 30);
  const login = readline.question('Login: ');
  if (login === 'q') {
    quitbool = true;
    bool = false;
    mainMenu();
  } else if (login.includes('/') || login[0] === '.') {
    updateinterface('Invalid input');
  } else {
    user.login = login;
    let database = fs.readFileSync(`./${gdir}/database.txt`, 'utf8');
    if (database !== '') database = deserialize(database);
    bool = check(login, database, 'login');
    updateinterface('Login unavailable');
  }
  return { bool, quitbool, login };
}

function RegisterPassword(bool, quitbool, user) {
  updateinterface();
  pos(11, 30);
  const password = readline.question('Password: ');
  if (password === 'q') {
    quitbool = true;
    bool = false;
    mainMenu();
  } else {
    user.password = password;
    const fileuser = `${JSON.stringify(user)},`;
    fs.appendFileSync(`./${gdir}/database.txt`, fileuser);
    pos(22, 1);
    mainMenu('Account created');
  }
  return password;
}

const Register = () => {
  let bool = true;
  let quitbool = false;
  const user = {};
  updateinterface();
  while (bool === true) {
    const obj = RegisterLogin(bool, quitbool, user);
    bool = obj.bool;
    quitbool = obj.quitbool;
  }
  if (quitbool === false) {
    RegisterPassword(bool, quitbool, user);
  }
};

function LoginLogin(quitbool, bool) {
  pos(11, 30);
  const login = readline.question('Login: ');
  if (login === 'q') {
    quitbool = true;
    bool = true;
    mainMenu('');
  } else {
    glogin = login;
    let database = fs.readFileSync(`./${gdir}/database.txt`, 'utf8');
    if (database !== '') database = deserialize(database);
    bool = check(login, database, 'login');
    updateinterface('Incorrect login');
  }
  return { quitbool, bool };
}

function LoginPassword(quitbool, bool) {
  updateinterface();
  while (bool === false) {
    pos(11, 30);
    const password = readline.question('Password: ');
    if (password === 'q') {
      quitbool = true;
      bool = true;
      mainMenu();
    } else {
      let database = fs.readFileSync(`./${gdir}/database.txt`, 'utf8');
      if (database !== '') database = deserialize(database);
      bool = check(password, database, 'password');
      updateinterface('Incorrect password');
    }
  }
  return quitbool;
}

const Login = () => {
  let bool = false;
  let quitbool = false;
  updateinterface();
  while (bool === false) {
    const obj = LoginLogin(quitbool, bool);
    bool = obj.bool;
    quitbool = obj.quitbool;
  }
  bool = false;
  if (quitbool === false) {
    quitbool = LoginPassword(quitbool, bool);
  }
  return quitbool;
};

function DocumentCreate(dir) {
  updateinterface();
  // fs.chmodSync(dir,300);
  box(10, 28, 4, 25);
  pos(11, 30);
  const name = readline.question('File Name: ');
  if (name === 'q') {
    documentMenu();
  } else if (name.includes('/') || name[0] === '.') {
    documentMenu('Invalid name');
  } else {
    const filepath = `./${dir}/${name}`;
    clear();
    box(1, 34, 4, 11);
    pos(2, 36);
    write('Content');
    pos(4, 1);
    const content = readline.question('');
    fs.appendFileSync(filepath, `${content} `);
    documentMenu('File saved');
  }
}

function DocumentOpen(dir) {
  updateinterface();
  box(10, 28, 4, 25);
  pos(11, 30);
  const name = readline.question('File Name: ');
  if (name === 'q') {
    documentMenu();
  } else {
    const filepath = `./${dir}/${name}`;
    if (!fs.existsSync(filepath)) {
      documentMenu('File not found');
    } else {
      clear();
      box(1, 34, 4, 20);
      pos(2, 36);
      write(name);
      pos(4, 1);
      const content = fs.readFileSync(filepath, 'utf8');
      write(content);
      pos(22, 1);
      console.log('Type q to go back');
      const quit = readline.question('');
      if (quit === 'q') documentMenu();
    }
  }
}

function DocumentDelete(dir) {
  updateinterface();
  box(10, 28, 4, 25);
  pos(11, 30);
  const name = readline.question('File Name: ');
  if (name === 'q') {
    documentMenu();
  } else {
    const filepath = `./${dir}/${name}`;
    if (!fs.existsSync(filepath)) {
      documentMenu('File not found');
    } else {
      fs.unlinkSync(filepath);
      clear();
      pos(22, 1);
      documentMenu('File deleted');
    }
  }
}

function DocumentList(dir) {
  clear();
  let i = 1;
  fs.readdirSync(dir).forEach(file => {
    console.log(`${i}.${file}\n`);
    i += 1;
  });
  pos(22, 1);
  console.log('Type q to go back');
  const quit = readline.question('');
  if (quit === 'q') documentMenu();
}

const Document = () => {
  let bool = true;
  documentMenu();
  while (bool === true) {
    pos(18, 37);
    const dir = `./${gdir}/${glogin}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const answer = readline.question('');
    if (answer === '1') {
      DocumentCreate(dir);
    } else if (answer === '2') {
      DocumentOpen(dir);
    } else if (answer === '3') {
      DocumentDelete(dir);
    } else if (answer === 'l') {
      DocumentList(dir);
    } else if (answer === 'q') {
      bool = false;
      mainMenu();
    }
  }
};

module.exports = {
  write,
  clear,
  pos,
  deserialize,
  check,
  documentMenu,
  mainMenu,
  box,
  updateinterface,
  RegisterLogin,
  RegisterPassword,
  Register,
  LoginLogin,
  LoginPassword,
  Login,
  DocumentCreate,
  DocumentOpen,
  DocumentDelete,
  DocumentList,
  Document,
};
