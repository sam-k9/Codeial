const db = require("../config/mongoose");
const User = require("../models/user");
const fs = require('fs');
const path = require('path');

module.exports.profile = function (req, res) {
  User.findById(req.params.id)
    .then((user) => {
      return res.render("user_profile", {
        title: "User Profile",
        profile_user: user
      });
    })
    .catch(err => console.log(`error ${err}`))
};

module.exports.update = async function (req, res) {

  if (req.user.id == req.params.id) {
    try {

      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) { console.log('****multer Error', err) }

        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {

          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
          }


          //this is saving the path of the uploaded file into the avatar field in th user
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect('back');
      });

    } catch (err) {
      req.flash('error', err);
      return res.redirect('back');
    }

  } else {
    req.flash('error', 'Unauthorised!');
    return res.status(401).send('Unauthorised!');
  }
}


//render singUP page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_up", {
    title: "COdeial: SIGN UP",
  });
};

//render signIN Page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_in", {
    title: "COdeial: SIGN IN",
  });
};

//gett the signup data
module.exports.create = async function (req, res) {

  try {

    if (req.body.password != req.body.confirm_password) {
      return res.redirect("back");
    }

    let user = await User.findOne({ email: req.body.email })

    if (!user) {

      await User.create(req.body);
      return res.redirect("/users/sign-in");

    } else {
      return res.redirect("back");
    }

  } catch (err) {
    console.log(err);
    return;
  }

};

//Sign in and creta a session for user
module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in Successfully');
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.logout(
    function (err) {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Logged out Successfully');
      return res.redirect("/");
    });


};
