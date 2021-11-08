const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../S3/s3");
const dotenv = require("dotenv");
dotenv.config();
const { db } = require("../models/index");


// 강아지 등록 여부
router.get("/dog_exist", auth, async (req, res) => {
  const user_id = res.locals.user.user_id;

  const dog = `SELECT * FROM dog WHERE dog.user_id ="${user_id}"`;
  const results = await db.query(dog);
  console.log("results:", results)

  if (results.length) {
    res.status(200).send(true);
  } else {
    res.status(401).send(false);
  }
});

// 내 정보 조회하기
router.get("/me", auth, async (req, res) => {
  try {
    const user_id = res.locals.user.user_id;

    const userQuery = `select user.user_id, user.user_nickname, user.user_gender, user.user_age, user.user_image from user where user.user_id= "${user_id}"`;
    await db.query(userQuery, async (err, user) => {
      if (err) {
        return res.status(400).json({
          success: false,
        });
      }
      return res.status(200).json({
        success: true,
        user,
      });
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
});

// 내 정보 수정하기
router.patch("/me", upload.single("user_image"), auth, async (req, res) => {
  try {
    const user_id = res.locals.user.user_id;

    console.log("req.body:", req.body);
    const { user_nickname, user_gender, user_age } = req.body;

    const user_image = req.file.location;

    const escapeQuery = {
      user_nickname: user_nickname,
      user_gender: user_gender,
      user_age: user_age,
      user_image: user_image,
    };

    console.log("여기: ", escapeQuery);

    const userQuery = `UPDATE user SET ? WHERE user.user_id = '${user_id}'`;

    await db.query(userQuery, escapeQuery, async (err, user) => {
      if (err) {
        return res.status(400).json({
          success: false,
        });
      }
      return res.status(200).json({
        success: true,
        msg: "user 정보 수정 성공!",
        user,
      });
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
});

//내가 쓴 글 조회하기 (마이페이지에서) 황유정
router.get("/mypage", auth, async (req, res) => {
    console.log("mypage 여기까지 옴");
    const user_id = res.locals.user.user_id;

    let exist_post;
    const post = `SELECT * FROM post WHERE post.user_id= "${user_id}"`;
    const results = await db.query(post);
    exist_post = results[0];

    console.log("existpost:", exist_post)

    if (!exist_post) {
      const query = `select user.user_id, user.user_nickname, user.user_gender, user.user_age, user.user_image from user where user.user_id= "${user_id}"`;

      await db.query(query, (error, rows) => {
        if (error) {
          console.log(error);
          return res.sendStatus(400);
        }
        res.status(200).json({
          posts: rows,
        });
        console.log(rows);
      });
    } else {
      const query = `select dog.dog_id, dog.dog_gender, dog.dog_name, dog.dog_size, dog.dog_breed, dog.dog_age, 
      dog.neutral, dog.dog_comment, dog.dog_image, post.post_id, post.meeting_date, post.user_id,
      user.user_id, user.user_nickname, user.user_gender, user.user_age, user.user_image 
      from post
      join dog
      on post.user_id = dog.user_id
      join user
      on user.user_id = dog.user_id
      WHERE post.user_id = "${user_id}";`;

      await db.query(query, (error, rows) => {
        if (error) {
          console.log(error);
          return res.sendStatus(400);
        }
        res.status(200).json({
          posts: rows,
        });
        console.log("rows", rows);
      });
    }
});

module.exports = router;
