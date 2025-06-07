const fs = require("fs");

// 执行目录
const implementDir = process.cwd();
const path = implementDir + "/public";

// 判断public目录是否存在
init()
  .then(() => {
    console.log("初始化成功");
  })
  .catch((err) => {
    console.log(err);
  });

async function init() {
  try {
    // 打开文件夹
    await handleOpenDir(path);
    const exist = judgeExistFile(path + "/manifest.json");
    if (exist) {
      const data = await handleReadFile(path + "/manifest.json");
      if (typeof data === "string") {
        const { nextTimestamp } = JSON.parse(data);
        const info = {
          lastTimestamp: nextTimestamp,
          nextTimestamp: Date.now(),
        };
        await handleCreateFile(path + "/manifest.json", info);
      }
    } else {
      // 创建manifest.json文件
      const data = {
        lastTimestamp: Date.now(),
        nextTimestamp: Date.now(),
      };
      await handleCreateFile(path + "/manifest.json", data);
    }
  } catch (e) {
    // 创建文件夹
    await handleCreateDir(path);
    // 创建manifest.json文件
    const data = {
      lastTimestamp: Date.now(),
      nextTimestamp: Date.now(),
    };
    await handleCreateFile(path + "/manifest.json", data);
  }
}

// 判断文件夹是否存在
function handleOpenDir(driPath) {
  return new Promise((resolve, reject) => {
    fs.open(driPath, "r", (err, fd) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
}

// 判断文件是否存在
function judgeExistFile(driPath) {
  return fs.existsSync(driPath);
}

// 创建文件夹
function handleCreateDir(driPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(driPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve("创建目录成功");
    });
  });
}

// 创建文件
function handleCreateFile(driPath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(driPath, JSON.stringify(data), (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve("创建文件成功");
    });
  });
}

// 读取文件
function handleReadFile(driPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(driPath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}
