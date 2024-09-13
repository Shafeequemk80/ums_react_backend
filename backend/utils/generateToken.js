import Jwt from 'jsonwebtoken'
 
const generateToken=(res,userId)=>{
    
    const token = Jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
   
    console.log(process.env.NODE_ENV !=="development");
 if (token) {
    
    res.cookie('Jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure cookies are secure only in production
        sameSite: 'None', // Required for cross-origin requests
        path: '/', // Set path to root
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
 }
}

export default generateToken