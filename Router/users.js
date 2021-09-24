const { Users } = require("../models/Users");
const bcrypt = require("bcrypt")
const router = require("express").Router();



/* ------------------------ [ users Router ] ---------------------------------*/

//      UPDATE THE USER
router.put("/:id", async (req, res) => {
   //  req.body.isAdmin
   if (req.body.userId === req.params.id) {

      //       updating the new password
      if (req.body.password) {
         try {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
         } catch (error) {
            return res.status(500).json(error)
         }

      }


      //    find updating the details of the user
      try {
         const user = await Users.findByIdAndUpdate(req.params.id, {
            $set: req.body
         })
         res.status(200).json("Account as been updated")
      } catch (error) {
         return res.status(500).json(error)
      }
   } else {
      return res.status(403).json("You can update only your account!")
   }
})



//       DELETE THE USER
router.delete("/:id", async (req, res) => {
   // || req.body.isAdmin
   if (req.body.userId === req.params.id) {
      //    find and Delete the account
      try {
         const user = await Users.findByIdAndRemove(req.params.id)
         res.status(200).json("Account as been Deleted Successfully ")
      } catch (error) {
         return res.status(500).json(error)
      }
   } else {
      return res.status(403).json("You can delete only your account!")
   }
})


//       GET USER
router.get("/", async (req, res) => {
   const userId = req.query.userId;
   const username = req.query.username
   try {
      const user = userId ? await Users.findById(userId) : await Users.findOne({ username: username })
      //       removing password and updatedAt from and then sending the dcos
      const { password, updatedAt, ...other } = user._doc
      res.status(200).json(other)
   } catch (error) {
      return res.status(500).json(error)
   }
})




//        follow a  user
router.put("/:id/follow", async (req, res) => {

   // || req.body.isAdmin
   if (req.body.userId !== req.params.id) {
      try {
         const user = await Users.findById(req.params.id)
         const currentUser = await Users.findById(req.body.userId)
         if (!user.followers.includes(req.params.id)) {
            await user.updateOne({ $push: { followers: req.body.userId } })
            await currentUser.updateOne({ $push: { following: req.params.id } })
            res.status(200).json("user followed")
         } else {
            res.status(403).json("you already follow this user")
         }
      } catch (error) {

      }
   } else {
      res.status(403).json("you can't follow your self")
   }
})


//        nofollow  user
router.put("/:id/unfollow", async (req, res) => {

   // || req.body.isAdmin
   if (req.body.userId !== req.params.id) {
      try {
         const user = await Users.findById(req.params.id)
         const currentUser = await Users.findById(req.body.userId)
         if (user.followers.includes(req.params.id)) {
            await user.updateOne({ $pull: { followers: req.body.userId } })
            await currentUser.updateOne({ $pull: { following: req.params.id } })
            res.status(403).json("user has been un followed")
         } else {
            res.status(403).json("you don't follow this user")
         }
      } catch (error) {

      }
   } else {
      res.status(403).json("you can't un follow your self")
   }
})


module.exports = router