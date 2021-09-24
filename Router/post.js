const router = require("express").Router();
const { Post } = require("../models/Post");
const { Users } = require("../models/Users");


/* ------------------------ [ users Router ] ---------------------------------*/


//         CREATE THE POST
router.post("/", async (req, res) => {
          const newPost = new Post(req.body)
          try {
                    const savaPost = await newPost.save()
                    res.status(200).json(savaPost)
          } catch (error) {
                    res.status(500).json(error)
          }
})



//         UPDATE THE POST
router.put("/:id", async (req, res) => {
          try {
                    const post = await Post.findById(req.params.id);
                    if (post.userId === req.body.userId) {
                              await post.updateOne({ $set: req.body })
                              res.status(200).json("post has been updated")
                    }
                    else {
                              res.status(403).json("you can update your post only")
                    }
          } catch (error) {
                    res.status(500).json(error)
          }
})




//         DELETE THE POST
router.delete("/:id", async (req, res) => {
          try {
                    const post = await Post.findById(req.params.id);
                    if (post.userId === req.body.userId) {
                              await post.deleteOne()
                              res.status(200).json("post has been Deleted")
                    }
                    else {
                              res.status(403).json("you can delete your post only")
                    }
          } catch (error) {
                    res.status(500).json(error)
          }
})



//         LIKE THE POST NAD DISLIKE THE POST
router.put("/:id/like", async (req, res) => {
          try {
                    const post = await Post.findById(req.params.id);
                    if (!post.likes.includes(req.body.userId)) {
                              await post.updateOne({ $push: { likes: req.body.userId } })
                              res.status(200).json("the post has been liked")
                    }
                    else {
                              await post.updateOne({ $pull: { likes: req.body.userId } })
                              res.status(403).json("you disliked the post")
                    }
          } catch (error) {
                    res.status(500).json(error)
          }
})




//         GET A POST
router.get("/:id", async (req, res) => {
          try {
                    const post = await Post.findById(req.params.id);
                    res.status(200).json(post)

          } catch (error) {
                    res.status(500).json(error)
          }
})



//        GET TIMELINE POSTS
router.get("/timeline/:userId", async (req, res) => {

          try {
                    const currentUser = await Users.findById(req.params.userId);

                    const userPosts = await Post.find({ userId: currentUser._id });
                    console.log(typeof (userPosts))
                    const friendPosts = await Promise.all(
                              currentUser.following.map((friendId) => {
                                        return Post.find({ userId: friendId });
                              })
                    );

                    res.status(200).json(userPosts.concat(...friendPosts));
          } catch (err) {

                    res.status(500).json(err);
          }
});




// GET USERS ALL POST
router.get("/profile/:username", async (req, res) => {

          try {

                    const user = await Users.findOne({ username: req.params.username });
                    const posts = await Post.find({ userId: user._id });
                    console.log(posts)
                    res.status(200).json(posts);
          } catch (err) {
                    res.status(500).json(err);
          }
});





module.exports = router