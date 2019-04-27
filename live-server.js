console.clear();
const fs = require("fs");
const path = require("path");
const chalk = require('chalk');
const debug = (data, information) => {
  if (information === 'error') {
    console.log(chalk.redBright(data));
  }
  if (information === 'success') {
    console.log(chalk.cyanBright(data));
  }
  if (information === 'warning') {
    console.log(chalk.yellowBright(data));
  }
};
const liveServer = require("live-server");
const parther = ['main', 'lai', 'ivy', 'bezier', 'Raven', 'Reynold', 'sally', 'LS'];

const params = {
    port: 9000, // 設定伺服器啟動時的使用的 Port. 預設不設定是 8080.
    host: "localhost", // 設定 IP 位置. 預設不設定為 0.0.0.0
    root: "./", // 設置要提供的根目錄。 默認為cwd。
    open: false, // 如果為false，默認情況下不會加載瀏覽器。
    ignore: 'css,scss,fonts,images,templates', // 要忽略的路徑的,逗號為分隔字符串
    file: "", // 設置後，為每個404提供此文件（服務器根相對）（對於單頁應用程序很有用）
    wait: 0, // 在重新加載之前等待所有更改。 默認為0秒。
    mount: [['/css', './node_modules']], // 將目錄掛載到路由
    logLevel: 1, // 0 = 僅錯誤，1 = 某些，2 = 批次
    middleware: [function(req, res, next) { next();}], // 採用一系列與Connect兼容的中間件，這些中間件被注入到服務器中間件堆棧中
};
// liveServer.start(params);
// console.log(process.cwd());

// 啟動 server
parther.forEach((item, key) => {
  const dir = './popUp/' + item;
  if (item !== 'main') checkFolder (dir);
  let newParams = params;
  newParams.port = key === 0 ? 9000 : newParams.port + (key * 10);
  newParams.root = item === 'main' ? './' : dir + "/";
  // console.log(newParams.root);
  if (!creatServer(newParams)) setTimeout(creatServer, 1500, newParams);
});

function creatServer (option) {
  if (!fs.existsSync(option.root + 'index.html') && option.root !== 'index.html') {
    return false;
  }
  liveServer.start(option);
  return true;
}

// 確認目錄是否存在
function checkFolder (folder) {
  let file = folder.replace(/.*(?:\/([^\/]*))$/g, '$1');
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  const checkFolder = [folder + '/index.html', 'scss/' + file + '.scss'];
  checkFolder.map(item => checkFile(item));

  // 新增基本文件
  function checkFile (item) {
    if (!fs.existsSync(item)) {
      debug(item.indexOf('index.html'), 'warning');
      if (item.indexOf('index.html') > 0) {
        fs.readFile(path.join(__dirname, 'template/index.html'), {encoding:'utf-8'}, (error, reads) => {
          if (error) throw error;
          reads = reads.replace(/{{(.*)}}/g, file);
          fs.writeFile(item, reads, () => {});
        })
      }
      if (item.indexOf('index.html') < 0) {
        fs.writeFile(item, "body {color: " + getRandomColor() + ";}");
      }
    }
  }
}

// 隨機色碼生成
function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}