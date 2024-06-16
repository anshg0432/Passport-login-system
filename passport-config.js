const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialize(passport ,getUserByEmail, getUserById){
  const authenticateUser = async (email,password,done)=>{
    const user = getUserByEmail(email)
    if (user == null){
      return done(null,false,{message: 'No user with that eamil'})
    }
    try{
      if(await bcrypt.compare(password, user.password)){
        return done(null,user)
      }
      else{
        return done(null,false, {message: 'Password incorrect'})
      }
    }catch(err){
      return done(err)
    }
  }


  // With the strategy configured, it is then registered by calling .use():
  passport.use(new LocalStrategy({usernameField: 'email'},
  authenticateUser))

  // To maintain a login session, Passport serializes and deserializes user information to and from the session. The information that is stored is determined by the application, which supplies a serializeUser and a deserializeUser function.
  passport.serializeUser((user,done)=>done(null,user.id))
  passport.deserializeUser((id,done)=>{
    return done(null,getUserById(id))
   })
} 


module.exports = initialize