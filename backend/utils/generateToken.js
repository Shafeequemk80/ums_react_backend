import Jwt from 'jsonwebtoken'
 
const generateToken=(res,userId)=>{
    
    const token = Jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
   
    console.log(process.env.NODE_ENV !=="development");
 if (token) {
    
    res.cookie('Jwt',token,{
        httpOnly:true,
        secure:true,
        sameSite:'none',
        domain:'ums-react-backend-code.onrender.com',
        path:'/',
        maxAge:30 * 24 * 60 * 60 * 1000
    })
 }
}

export default generateToken