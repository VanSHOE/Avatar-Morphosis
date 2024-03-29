import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";
// User Model
import User from "../models/User.js";
import { uuid } from "uuidv4";
const JWT_SECRET = "sl_myJwtSecret";
const router = Router();
// import setProfilePic from "../controllers/userController.js";
// const userController = require("../controllers/userController");
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import Feedback from "../models/Feedback.js";

// import multer from

const s3 = new aws.S3({
  accessKeyId: "AKIAYHPA6LXECM6G72LJ",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const upload = (bucketName) =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `image-${Date.now()}.jpeg`);
      },
    }),
  });

router.post("/setProfilePic", auth, async (req, res) => {
  console.log(req.files);
  const uploadSingle = upload("profile-picture-upload-site").single(
    "croppedImage"
  );
  User.findOne({ id: req.user.id }).then((user) => {
    uploadSingle(req, res, async (err) => {
      if (err)
        return res.status(400).json({ success: false, message: err.message });

      // await User.create({ photoURL: req.file.location });
      console.log("Success?");
      console.log(req.file.location);
      user.photoURL = req.file.location;
      user.save();
      res.status(200).json({ user: user.fname, data: req.file.location });
    });
  });
});

/**
 * @route   POST api/auth/login
 * @desc    Login user
 * @access  Public
 */

// module.exports = router;/

router.post("/glogin", (req, res) => {
  const email = req.body.email;
  // Find user by email
  User.findOne({ email })
    .then((user) => {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
      if (!token) throw Error("Couldnt sign the token");

      res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_admin: user.user_type === "admin" ? true : false,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send("User not found");
    });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  // Simple validation
  if (!email || !password) {
    console.log("AAAH");
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) throw Error("User does not exist");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error("Invalid credentials");

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
    if (!token) throw Error("Couldnt sign the token");

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.user_type === "admin" ? true : false,
      },
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   POST api/users
 * @desc    Register new user
 * @access  Public
 */

router.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  console.log(req.body);
  // Simple validation
  if (!fname || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (user) throw Error("User already exists");

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error("Something went wrong hashing the password");

    const newUser = new User({
      id: uuid(),
      fname,
      lname,
      email,
      password: hash,
      user_type: "user",
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Something went wrong saving the user");

    const token = jwt.sign({ id: savedUser.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log(token);
    res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        user_type: savedUser.user_type,
        photoURL: savedUser.photoURL,
        is_admin: savedUser.user_type === "admin" ? true : false,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */

router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw Error("User does not exist");
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post("/setProfilePic", auth, async (req, res) => {
  User.findOne({ id: req.user.id })
    .then((user) => {
      user.photoURL = req.body.photoURL;
      user.save();
      res.status(200).send("Profile pic updated");
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Profile pic not updated");
    });
});

router.post("/update", auth, async (req, res) => {
  User.findOne({ id: req.user.id })
    .then((user) => {
      if (req.body.fname) user.fname = req.body.fname;
      if (req.body.lname) user.lname = req.body.lname;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;

      user.save();
      res.status(200).send("User updated");
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: err.message });
    });
});

router.get("/get_details", auth, async (req, res) => {
  User.findOne({ id: req.user.id })

    .then((user) => {
      res.status(200).send({
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        reg_date: user.register_date.toDateString(),
        photoURL: user.photoURL,
        is_admin: user.user_type === "admin" ? true : false,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: err.message });
    });
});

router.post("/feedback", auth, async (req, res) => {
  const { feedback } = req.body;
  console.log(feedback);
  // Simple validation
  if (!feedback) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) throw Error("User does not exist");

    const newFeedback = new Feedback({
      id: uuid(),
      user: user.id,
      text: feedback,
    });

    const savedFeedback = await newFeedback.save();
    if (!savedFeedback) throw Error("Something went wrong saving the feedback");

    res.status(200).json({
      id: savedFeedback.id,
      user_id: savedFeedback.user_id,
      feedback: savedFeedback.feedback,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
});

router.get("/get_feedbacks", auth, async (req, res) => {
  try {
    // check if user is admin
    const user = await User.findOne({ id: req.user.id });
    if (!user) throw Error("User does not exist");

    if (user.user_type !== "admin") {
      return res.status(401).json({ msg: "You are not authorized" });
    }

    const feedbacks = await Feedback.find({});
    if (!feedbacks) throw Error("No feedbacks found");
    res.status(200).json(feedbacks);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post("/del_feedback", auth, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) throw Error("User does not exist");

    if (user.user_type !== "admin") {
      return res.status(401).json({ msg: "You are not authorized" });
    }

    const feedback = await Feedback.findOne({ id: req.body.id });
    if (!feedback) throw Error("Feedback does not exist");

    await Feedback.deleteOne({ id: req.body.id });
    res.status(200).json({ msg: "Feedback deleted" });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

export default router;
