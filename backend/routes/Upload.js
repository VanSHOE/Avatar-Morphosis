import express from "express";
var router = express.Router();
import path from "path";
import multer from "multer";
import fs from "fs";
import File from "../models/File.js";
import Result from "../models/Result.js";
import axios from "axios";
import FormData from "form-data";
import http from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";
import sleep from "sleep-promise";
import auth from "../middleware/auth.js";
import ObjectId from "mongoose";
import { uuid } from "uuidv4";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { Curl } from "node-libcurl";
import { exit } from "process";
import User from "../models/User.js";
let cur_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNmNjZWJiMGYtMWNmNy00NWVkLTk3MDItOWM2NDQ3MDdlOGVmIiwiYXVkIjoiZmFzdGFwaS11c2VyczphdXRoIiwiZXhwIjoxNjQ5MTQ5NTkyfQ.i7PAr4jyNOxfXmdXtUyJXgv6ZdC2sxAmQ-uWXZZAHpg";
const ngrok_URL = "http://457359bc3a7b.ngrok.io/";
const storageEngine = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
// function login() {
//   const url = "http://canvas.iiit.ac.in/lipsyncuc3/auth/login";
//   const params = new URLSearchParams();
//   params.append("username", "3davatar@lipsync.com");
//   params.append("password", "password");

//   const config = {
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   };

//   axios
//     .post(url, params, config)
//     .then((result) => {
//       console.log("ss");
//       cur_token = result.data.access_token;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }
const fileFilter = (req, file, callback) => {
  let pattern = /jpg|png|svg|m4a|mp4/; // reqex

  if (pattern.test(path.extname(file.originalname))) {
    callback(null, true);
  } else {
    callback("Error: not a valid file");
  }
};
const upload = multer({
  storage: storageEngine,
  fileFilter,
});
router.post("/upload", auth, upload.single("uploadedFile"), (req, res) => {
  console.log("Upload complete");
  // console.log(req);
  //   console.log(req.file);

  res.status(200).json(req.file.path);
});

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

router.post("/add", auth, (req, res) => {
  console.log("hi");
  //   console.log(req);

  const audio_regex = /m4a/;
  const video_regex = /mp4/;
  const image_regex = /jpg|png|svg/;
  const ext = path.extname(req.body.path);
  var type;
  if (audio_regex.test(ext)) {
    type = "audio";
  } else if (video_regex.test(ext)) {
    type = "video";
  } else if (image_regex.test(ext)) {
    type = "image";
  } else {
    console.log(req.body);
    return res.status(400).send("Invalid extension");
  }
  let new_path =
    "./uploads/" + req.user.id + "/files/" + uuid() + "_" + req.body.name + ext;
  console.log("Verifying directory: " + new_path);
  ensureDirectoryExistence(new_path);
  fs.rename("./" + req.body.path, new_path, () => {
    const newFile = new File({
      name: req.body.name,
      path: new_path,
      purpose: req.body.purpose,
      type: type,
      user: req.user.id,
      id: uuid(),
    });

    console.log(newFile);
    newFile
      .save()
      .then((file) => {
        res.status(200).json(file);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  });
});

router.get("/get_files", auth, (req, res) => {
  File.find({ $or: [{ user: req.user.id }, { user: "common" }] })
    .then((files) => {
      res.status(200).json(files);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.post("/del_result", auth, (req, res) => {
  User.findOne({ id: req.user.id }).then((user) => {
    Result.findOne({ id: req.body.id }).then((to_del) => {
      if (to_del.user == user.id || user.user_type == "admin") {
        console.log("Deleting");
        console.log(to_del);
        fs.unlinkSync("./" + to_del.path, (err) => {
          if (err) {
            console.log(err);
          }
        });
        Result.deleteOne({ id: req.body.id })
          .then((del) => {
            console.log(del);

            res.status(200).json("Deleted");
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send(err);
          });
      } else {
        res.status(401).send("Not authorized");
      }
    });
  });
});

router.post("/get_result", auth, (req, res) => {
  // console.log("BODY?");
  // console.log(req.body);
  User.findOne({ id: req.user.id }).then((user) => {
    if (user.user_type == "admin" && req.body.show_all) {
      Result.find()
        .then((results) => {
          res.status(200).json(results);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send(err);
        });
    } else {
      Result.find({ user: req.user.id })
        .then((results) => {
          res.status(200).json(results);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send(err);
        });
    }
  });
});

// function ensure_login() {
//   const url = "http://canvas.iiit.ac.in/lipsyncuc3/users/me";
//   axios
//     .get(url, {
//       headers: {
//         "Content-type": "application/json",
//         Authorization: "bearer " + cur_token,
//       },
//     })
//     .then((response) => {
//       console.log("Already Logged in");
//     })
//     .catch((err) => {
//       console.log("Could not log in, logging in now!");
//       login();
//     });
// }
router.get("/get_user", (req, res) => {
  //   console.log("hi");
  //   console.log(req);

  const url = "http://canvas.iiit.ac.in/lipsyncuc3/users/me";

  axios
    .get(url, {
      headers: {
        "Content-type": "application/json",
        Authorization: "bearer " + cur_token,
      },
    })
    .then((response) => {
      console.log(response.data);
      res.status(200).json(response.data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

// function get(url, resolve, reject) {
//   http.get(url, (res) => {
//     // if any other status codes are returned, those needed to be added here
//     // console.log("Url: " + url);
//     // console.log("Status code: " + res.statusCode);
//     if (res.statusCode === 301 || res.statusCode === 302) {
//       return get(res.headers.location, resolve, reject);
//     }
//     return url;
//   });
// }

router.post("/test", auth, async (req, res) => {
  var obj2 = {
    url: "https://mernvendorbuyer.me/api/uploads/result.mp4",
    user: req.user,
  };
  // Sleep for 5 seconds
  await sleep(2000);
  res.status(200).json(obj2);
});

router.post("/mark_seen", auth, (req, res) => {
  console.log(req.body);
  const result_id = req.body.id;
  Result.findOne({ id: result_id, user: req.user.id })
    .then((result) => {
      result.seen = true;
      result.save();
      console.log("Marked seen");
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.post("/modelize", auth, async (req, res) => {
  // ensure_login();
  // Check if eq has audio_path
  if (req.body.audio_path == null || req.body.image_path == null) {
    return res.status(400).send("Files not sent properly");
  }
  if (
    !fs.existsSync(req.body.audio_path) ||
    !fs.existsSync(req.body.image_path)
  ) {
    return res.status(400).send("Files not found");
  }
  let url = ngrok_URL;
  const formData = new FormData();
  formData.append("file", fs.createReadStream(req.body.image_path));
  // append audio
  formData.append("audio", fs.createReadStream(req.body.audio_path));
  try {
    console.log("Beginning");
    const getFile = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    console.log(getFile.data);
    const fileName = uuid();
    const interm_path = "uploads/" + req.user.id + "/results/" + fileName + ".mp4";
    ensureDirectoryExistence(interm_path);

    const file = fs.createWriteStream("./" + interm_path);

    const request = http.get(url + "uploads/result_voice.mp4", function (response) {
      response.pipe(file);
      // after download completed close filestream
      file.on("finish", () => {
        // console.log("Lipsyncing");
        file.close();
        console.log("Download of result Completed");
        axios.post(url + "del_result");

        // after download completed close filestream
        console.log("Download Completed");

        const newResult = new Result({
          id: uuid(),
          name: req.body.name ? req.body.name : fileName,
          path: interm_path,
          user: req.user.id,
        });

        console.log(newResult);
        newResult
          .save()
          .then((final_result) => {
            var obj2 = {
              url: "https://mernvendorbuyer.me/api/" + interm_path,
              id: final_result.id,
            };
            res.status(200).json(obj2);
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send(err);
          });

        console.log("Over");
      });
    });
  } catch (e) {
    // console.log(e, "getFileError");
    res.status(400).send(e);
  }
});

export default router;
