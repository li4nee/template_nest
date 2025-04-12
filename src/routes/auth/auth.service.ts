import { Injectable } from "@nestjs/common";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { User } from "src/entity/user.entity";
import { ROLES, Token } from "src/types/base.type";
import { Mailer } from "src/shared/services/mailer.service";
import { globalSettings } from "src/config/settings.config";
import { LoginGlobalStore } from "src/shared/store/login.store";
import { clearCookie, generateToken, hashPassword, verifyHash } from "src/utils/base.utiils";
import { InvalidInputError } from "src/types/error.type";
import { UserRepository } from "src/repo/models/user.repo";
import { emailTemplate } from "src/template/email.template";

@Injectable()
export class AuthService {
    constructor(
        private readonly mailer:Mailer,
        private readonly LoginGlobalStore:LoginGlobalStore,
        private readonly UserModel:UserRepository
    ) {}
    async login(data:LoginDto)
    {
        let user = await this.UserModel.model.findOne({
            where:{email:data.email,trash:false},
            select:{id:true,email:true,password:true,role:true,isEmailVerified:true,isBlocked:true
            }})
        if(!user)
            throw new InvalidInputError("Invalid email or password")
        if(user.isEmailVerified === false)
        {   
            await this.sendEmailVerification(user.email,user.role,user.id)
            return {message:"Check your email for verification link"}
        }
        if(user.isBlocked)
            throw new InvalidInputError("User's account is blocked")
        if(!verifyHash(data.password,user.password))
            throw new InvalidInputError("Invalid email or password")
        let token = generateToken(globalSettings.JWT_SECRET,{user:{userId:user.id,role:user.role}},60*60*24)
        await this.LoginGlobalStore.setLoginToken(token,user.id)
        return {message:"Login successfull.",token}

    }

    async register(data:RegisterDto)
    {   if(data.confirmPassword !== data.password)
            throw new InvalidInputError("Password and confirm password do not match")
        await this.checkForExistingEmail(data.email)
        let user = new User()
        user.email = data.email
        user.password = hashPassword(data.password)
        user.role= ROLES.USER
        user.isEmailVerified = false
        user.isBlocked = false
        await Promise.all([
            this.UserModel.model.save(user),
            this.sendEmailVerification(user.email,user.role,user.id)
        ])
        return {message:"Check your email for verification link"}
    }

    async verifyEmail(token:string)
    {
        let decodedToken:Token = await this.LoginGlobalStore.verifySecondaryToken(token) 
        if(!decodedToken)
            throw new InvalidInputError("Invalid token")
        let user = await this.UserModel.model.findOne({where:{id:decodedToken.user.userId,role:decodedToken.user.role,trash:false}})
        if(!user)
            throw new InvalidInputError("Invalid token")
        if(user.isEmailVerified)
            throw new InvalidInputError("Email already verified")
        user.isEmailVerified = true
        await Promise.all([
            this.UserModel.model.save(user),
            this.LoginGlobalStore.removeSecondaryToken(token, user.id)
        ])
        return {message:"Email verified successfully"}
    }

    async logout(userId:string,token:string,res:any)
    {
        await this.LoginGlobalStore.removeLoginToken(userId,token)
        clearCookie(res)
        return {message:"Logout successfull"}
    }
    // HELPER FUNCTIONS
    private async checkForExistingEmail(email:string)
    {
        let user = await this.UserModel.model.findOne({where:{email,trash:false},select:{id:true,isEmailVerified:true}})
        if(user && user.isEmailVerified === false)
        {
            await this.sendEmailVerification(email,user.role,user.id)
            throw new InvalidInputError("Email already registered. Check your email for verification link")
        }
    }

    private async sendEmailVerification(email:string,role:ROLES,userId:string)
    {   let token = generateToken(globalSettings.JWT_SECRET,{user:{userId,role}},60*60*24)
        let url = globalSettings.APP_URL + "/api/v1/auth/verify-email" 
        let text = emailTemplate.verifyEmail(url,token)
        let subject = "Email Verification"
        await this.LoginGlobalStore.setSecondaryToken(token,userId,60*60)
        this.mailer.sendMailHTML(email,text,subject).catch(()=>{})
    }

}
