
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy= require('passport-local').Strategy;
app.use(session({
    secret: "random string",
    cookie: { maxAge: 1000 * 60 * 60 * 48 },
    saveUninitialized: false,
    resave: false,
    sameSite: "none",
    secure: true,
  })
);
app.use(passport.initialize());
app.use(passport.session())


app.set("trust proxy", 1);
const PORT = process.env.PORT || 4001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

require("./config/passport");

app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}))
app.use(require("./routes/index.routes"));

app.get("/", (req, res) => {
  const user = req.user || "Guest";
  res.render("home", { user });
});
app.get('/logout', (req, res)=>{
  req.logout()
  res.redirect('/login')
})

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
