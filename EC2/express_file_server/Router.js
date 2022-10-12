const router = require("express").Router();
const ffmpeg = require("fluent-ffmpeg");
const url = require("url");
const fs = require("fs");
const { get } = require("http");

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
  fs.unlink("resource/" + vidName, (err) => {
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

router.get("/exercise/*", (req, res) => {
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

router.post("/exercise/", (req, res) => {
  const vidPath = "./resource/exercise";
  const file = req.files.file;
  const vidName = file.name;

  console.log(file);

  file.mv("resource/" + vidName, (err) => {
    if (err) return res.sendStatus(500).send(err);
    console.log("File Uploaded successfully");
  });

  try {
    fs.unlinkSync("resource/exercise/output.mp4");
    console.log("deleted old one");
  } catch (err) {
    (err) => {
      console.log("this is error but not an error");
      console.log("upload success");
    };
  }

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
      res.send("upload success!");
    })
    .saveToFile(`${vidPath}/${vidName}`);
});

router.get("/apps/*", (req, res) => {
  const { pathname } = url.parse(req.url, true);
  const file = `./resource${pathname}`;
  res.download(file, (err) => {
    if (err) console.log(err);
  });
});

module.exports = router;
