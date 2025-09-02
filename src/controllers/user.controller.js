import {asyncHandler} from "../utils/asyncHandler.js"
import  {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser=asyncHandler(async(req,res)=>{
// get user details from frontend
//   validation-not empty
//   check if user already exists:username and email
//   chck for images,check for avatar
//   upload them to cloudinary
//   create user object-create entry in db
//   remove password and refresh token feild from response
//   check for user creation
//   return response
console.log("files recieved:",req.files);
console.log("body recieved:",req.body);


  const {fullName,email,username,password}=req.body
  console.log("email:",email);

  if (
    [fullName,email,username,password].some((feild)=>      //   validation-not empty
      feild?.trim()=="")
  ) {
      throw new ApiError(400,"All feilds are required")
  }

  const existedUser=await User.findOne({                       //check if user already exists:username and email
    $or:[{ username },{ email }]
  })
  if (existedUser) {
    throw new ApiError(409,"user with email or username already exited")
  }

    const avatarLocalPath=req.files?.avatar?.[0]?.path;               //   check for images,check for avatar
    const coverImageLocalPath=req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)            //   upload them to cloudinary
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)


    if(!avatar){
      throw new ApiError(400, "Avatar file is required")
    }

    const user=await User.create({                              //   create user object-create entry in db
      fullName,
      avatar:avatar.url,
      coverImage:coverImage?.url||"",
      email,
      password,
      username:username.toLowercase()
    })

    const createdUser=await User.findById(user._id).select(          //   remove password and refresh token feild from response
      "-password -refreshToken"
    )

    if(!createdUser){                                                            //check for user creation
      throw new ApiError(500,"something went wrong while registering user")
    }

    return res.status(201).json(                                                //   return response
      new ApiResponse(200,createdUser,"User registered Successfully")
    )



  
})


const generateAccessAndRefreshTokens=async(userId)=>{
  try {
    const user=await User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}


    
  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating access token")
    
  }
}

const loginUser=asyncHandler(async(req,res)=>{
  //bring data from req body
  //check username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie
  //send res


  const {email,username,password}=req.body

  if (!username || !email) {
    throw new ApiError(400,"username or password is required");
  }

  const user=await User.findOne({
    $or:[{username},{email}]
  })

  if (!user) {
    throw new ApiError(404,"User does not exists")
  }

  const isPasswordValid=await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401,"Invalid password")
  }
  const{accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)



})

export {registerUser,
  loginUser
}





  