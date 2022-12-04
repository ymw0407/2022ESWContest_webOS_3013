const router = require("express").Router();
const ffmpeg = require("fluent-ffmpeg");
const WebOSApp = require("./WebOSApp");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const url = require("url");
const fs = require("fs");
const { get } = require("http");
const exec = require("child_process").exec;

router.get("/vidlist", (req, res) => {
    const DATA = "resource/" + req.headers.app;
    let vidlist = [];
    fs.readdir(DATA, (err, vids) => {
        if (err) {
            console.log(err);
            res.status(500).send("Interal Server Error");
        }
        vids.forEach((vid) => {
            vidlist.unshift(vid.replace(".mp4", ""));
        });
        console.log(vidlist);
        res.json({ vidlist: vidlist });
    });
});

router.get("/package/", (req, res) => {
    const body = `
<html>
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>
      <form action="/package" enctype="multipart/form-data" method="post">
          <input type="file" name="file" multiple="multiple">
          <input type="submit" value="Upload file" />
      </form>
  </body>
</html>
`;
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(body);
    res.end();
});

router.post("/package/", (req, res) => {
    const vidPath = "./resource/package";
    const file = req.files.file;
    console.log(file);
    const vidName = file.name;

    file.mv("resource/" + vidName, (err) => {
        if (err) return res.sendStatus(500).send(err);
        console.log("File Uploaded successfully");
    });

    ffmpeg("resource/" + vidName)
        .videoCodec("libx264")
        .withOutputFormat("mp4")
        .on("error", (err) => {
            console.log(err.message);
            fs.unlink("resource/" + vidName, (err) => {
                if (err) throw err;
                console.log("file deleted");
            });
        })
        .on("end", () => {
            console.log("upload complete");

            fs.unlink("resource/" + vidName, (err) => {
                if (err) throw err;
                console.log("file deleted");
            });
            res.status(200).send("upload success!");
        })
        .saveToFile(`${vidPath}/${vidName}`);
});

router.get("/package/*", (req, res) => {
    const { pathname } = url.parse(req.url, true);
    const filepath = `./resource${pathname}`;

    const stat = fs.statSync(filepath);
    const fileSize = stat.size;
    const range = req.headers.range;
    console.log(range);

    if (!range) {
        const header = { "Content-Type": "video/mp4" };
        res.writeHead(200, header);
        res.end();
    } else {
        const MAX_CHUNK_SIZE = 1000 * 1000 * 50;
        // ranage헤더 파싱
        const parts = range.replace(/bytes=/, "").split("-");
        // 재생 구간 설정
        const start = parseInt(parts[0], 10);
        const _end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const end = Math.min(_end, start + MAX_CHUNK_SIZE - 1);

        const header = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Type": "video/mp4",
            "Content-Length": fileSize - 1,
        };
        res.writeHead(206, header);
        const readStream = fs.createReadStream(filepath, { start, end });
        readStream.pipe(res);
    }
});

router.delete("/package/*", (req, res) => {
    const vidPath = url.parse(req.url, true);
    fs.unlink("resource" + vidPath, (err) => {
        if (err) throw err;
        console.log("file deleted");
        res.sendStatus(200).send("file deleted");
    });
});

router.get("/exercise/", (req, res) => {
    const body = `
<html>
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>
      <form action="/exercise" enctype="multipart/form-data" method="post">
          <input type="file" name="file" multiple="multiple">
          <input type="submit" value="Upload file" />
      </form>
  </body>
</html>
`;
    res.writeHead(200, { "Content-Type": "text/html" });

    const DATA = "resource/exercise";
    let vidlist = [];
    fs.readdir(DATA, (err, vids) => {
        if (err) {
            console.log(err);
            res.status(500).send("Interal Server Error");
        }
        vids.forEach((vid) => {
            vidlist.unshift(vid.replace(".mp4", ""));
        });
        console.log(vidlist);
    });

    res.write(body);
    res.send("upload succuess!");
});

router.get("/exercise/output/*", (req, res) => {
    const { pathname } = url.parse(req.url, true);
    const filepath = `./resource${pathname}`;

    const stat = fs.statSync(filepath);
    const fileSize = stat.size;
    const range = req.headers.range;
    console.log(range);

    if (!range) {
        const header = { "Content-Type": "video/mp4" };
        res.writeHead(200, header);
        res.end();
    } else {
        const MAX_CHUNK_SIZE = 1000 * 1000 * 50;
        // ranage헤더 파싱
        const parts = range.replace(/bytes=/, "").split("-");
        // 재생 구간 설정
        const start = parseInt(parts[0], 10);
        const _end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const end = Math.min(_end, start + MAX_CHUNK_SIZE - 1);

        const header = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Type": "video/mp4",
            "Content-Length": fileSize - 1,
        };
        res.writeHead(206, header);
        const readStream = fs.createReadStream(filepath, { start, end });
        readStream.pipe(res);
    }
});

const analyzeStart = () => {
    return new Promise((resolve, reject) => {
        process = exec("python3 pushup.py");

        process.stdout.on("data", (data) => {
            console.log(data);
        });

        // process.stderr.on("data", (err) => {
        //     reject(err);
        // });

        process.on("exit", (code) => {
            resolve(code);
        });
    });
};

router.post("/exercise/", async (req, res) => {
    const file = req.files.file;
    var vidPath = "./resource/exercise/input/";
    var vidName = file.name;

    console.log("[exerise post] :" + file);

    file.mv("resource/exercise/input/" + vidName, (err) => {
        if (err) {
            console.log("[mvFile] error : " + err);
            return res.sendStatus(500).send(err);
        }
        console.log("[mvFile] success : File Uploaded successfully");
        console.log("[mvFile] file path : " + vidPath + vidName);
        return res.sendStatus(200).send(err);
    });

    await analyzeStart()
        .then((result) => {
            console.log("[analyzeStart] exit : " + result);
            vidName = "progress.mp4";
            vidPath = "./resource/exercise/progress/";
            console.log("[analyzeStart] file path : " + vidPath + vidName);
        })
        .catch((err) => {
            fs.unlink(vidPath + vidName, (err) => {
                if (err) throw err;
                console.log(
                    "[analyzeStart] " + vidPath + vidName + " file deleted"
                );
            });
            console.log("[analyzeStart] err : " + err);
        });

    ffmpeg("./resource/exercise/progress/progress.mp4")
        .videoCodec("libx264")
        .withOutputFormat("mp4")
        .on("error", (err) => {
            console.log(err.message);
            fs.unlink("./resource/exercise/progress/" + vidName, (err) => {
                if (err) throw err;
                console.log("[ffmpeg] " + vidPath + vidName + " file deleted");
            });
        })
        .on("end", () => {
            console.log("upload complete");
            fs.unlink("./resource/exercise/progress/" + vidName, (err) => {
                if (err) throw err;
                console.log("[ffmpeg] " + vidPath + vidName + " file deleted");
            });
        })
        .saveToFile("./resource/exercise/output/output.mp4");
});
router.get("/apps/list/", (req, res) => {
    res.send([
      new WebOSApp(
        "배달",
        "com.delivery.app",
        "택배 상자 인식을 통한 배달 도난 방지 기능",
        "delivery.png"
      ),
      new WebOSApp(
        "차량",
        "com.registercar.app",
        "방문 차량 접수도 간단하게! 차량 스케줄링 기능",
        "registercar.png"
      ),
      new WebOSApp(
        "CCTV",
        "com.cctv.app",
        "우리 아이 안전한가요...? CCTV 기능",
        "CCTV.png"
      ),
      new WebOSApp(
        "가전제어",
        "com.control.app",
        "터치 한번으로 간편하게!",
        "control.png"
      ),
      new WebOSApp(
        "운동보조",
        "com.exercise.app",
        "집에서도 운동하자! 홈 트레이닝 도우미 기능",
        "exercise.png"
      ),
    ]);
  });
    
router.get("/apps/*", (req, res) => {
    const { pathname } = url.parse(req.url, true);
    const file = `./resource${pathname}`;
    res.download(file, (err) => {
        if (err) console.log(err);
    });
});

module.exports = router;
