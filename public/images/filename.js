var fs = require("fs");
var mongo = require('../../db/mongodb');
// var images=require('images');
//path模块，可以生产相对和绝对路径
var path = require("path");

//配置远程路径
var remotePath = "/resource/fd/promote/201507/qixi/";

//获取当前目录绝对路径，这里resolve()不传入参数
var filePath = __dirname;
console.log(filePath);
//读取文件存储数组
var fileArr = [];

//读取文件目录
fs.readdir(filePath, function(err, files) {
    if (err) {
        console.log(err);
        return;
    }
    var count = files.length;
    console.log(files);
    var results = {};
    files.forEach(function(filename) {

        //filePath+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
        fs.stat(path.join(filePath, filename), function(err, stats) {
            if (err) throw err;
            //文件
            if (stats.isFile()) {
                // if(getdir(filename) == 'html'){
                //     var newUrl=remotePath+filename;
                //     fileArr.push(newUrl);
                //     writeFile(fileArr);
                // }
                // // (getdir(filename) == 'html')&&(fileArr.push(filename);writeFile(newUrl));
                var image = {
                    "title": "code0",
                    "src": "",
                    "createTime": "",
                    "lastModifyTime": "",
                    "lastAccessTime": "",
                    "size": "",
                    "kind": "",
                    "dimensions": "",
                    "colorSpace": "",
                    "alphaChannel": "",
                    "Extension": ""
                };
                image.Extension = path.extname(filename);
                image.title = path.basename(filename,image.Extension);
                image.src = path.join('/images',filename);
                image.size = stats.size; 
                console.log(image);               
                mongo.insertMany([image], function(result) {
                    // console.log("%s is file", path.join(filePath, filename));
                });
            }
        });
    });
});


//获取后缀名
function getdir(url) {
    var arr = url.split('.');
    var len = arr.length;
    return arr[len - 1];
}

//获取文件数组
function readFile(readurl, name) {
    console.log(name);
    var name = name;
    fs.readdir(readurl, function(err, files) {
        if (err) { console.log(err);
            return; }

        files.forEach(function(filename) {
            // console.log(path.join(readurl,filename));

            fs.stat(path.join(readurl, filename), function(err, stats) {
                if (err) throw err;
                //是文件
                if (stats.isFile()) {
                    var newUrl = remotePath + name + '/' + filename;
                    fileArr.push(newUrl);
                    writeFile(fileArr)
                        //是子目录
                } else if (stats.isDirectory()) {
                    var dirName = filename;
                    readFile(path.join(readurl, filename), name + '/' + dirName);
                    //利用arguments.callee(path.join())这种形式利用自身函数，会报错
                    //arguments.callee(path.join(readurl,filename),name+'/'+dirName);
                }
            });
        });
    });
}


// 写入到filelisttxt文件
function writeFile(data) {
    var data = data.join("\n");
    fs.writeFile(filePath + "/" + "filelist.txt", data + '\n', function(err) {
        if (err) throw err;
        console.log("写入成功");
    });
}
