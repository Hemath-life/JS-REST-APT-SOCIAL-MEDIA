// ------------------------ [ Modules ] ---------------------------------
const router = require("express").Router();
const bcrypt = require("bcrypt")


// ------------------------ [ Custom Models ] ---------------------------------
const { Users } = require("../models/Users");


/* ------------------------ [ users Router ] ---------------------------------*/
// REGISTER
router.post("/register", async (req, res) => {

    try {
        //     Generating new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //        Create the new user
        const newUser = new Users({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        //       Save the user Data and Returning the response
        const user = await newUser.save();
        res.status(200).json({ user })

    } catch (error) {
        res.status(500).json(error)
    }
})




// LOGIN
router.post("/login", async (req, res) => {
    try {
        console.table(req.body.email)
        //      Find the user using email
        const user = await Users.findOne({ email: req.body.email })
        !user && res.status(404).json("user not found")

        //      Matching the password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("password not matching")

        //      Return the result
        res.status(200).json({ user })
    } catch (error) {
        // res.status(500).json(error)
    }
})

module.exports = router