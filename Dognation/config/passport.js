const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const helper = require("../helpers/helper");


passport.use(new LocalStrategy(
  async function (username, password, done) {
    try {
      const user = await helper.findByUsername(username);
      if (!user) {
        return done(null, false); 
      }
      const matchedPassword = await bcrypt.compare(password, user.password);
      if (!matchedPassword) {
        return done(null, false); 
      }
      return done(null, user); 
    } catch (err) {
      return done(err); 
    }
  }
));
// Serialize a user
passport.serializeUser((user, done)=>{
  done(null, user.id)
})
// Deserialize a user
passport.deserializeUser((id, done)=>{
  helper.findById(id, (err, user)=>{
    if (err) return done(err)
    return done(null, user)
  })
})