import { Body, Controller, Get, Post, Put, Query,Req,Res, UseGuards} from "@nestjs/common";
import { Response } from "express";
import { LoginDto, loginSchema, registerSchema } from "./dto/auth.dto";
import { AuthService } from "./auth.service";
import { UseBruteForceLimit} from "src/decorator/bruteforce.decorator";
import { InvalidInputError } from "src/types/error.type";
import { setCookie } from "src/utils/base.utiils";
import { LoginGuard } from "src/auth/login.guard";
import { AuthorizedRequest } from "src/types/base.type";

@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/login")
    @UseBruteForceLimit({blockDuration:60*30,requestLimit:5,timeLimit:60*10,keyType:'LOGIN',isForError:true})
    async login(@Body()Body:LoginDto,@Res()res:Response) {
       let data = loginSchema.validateSync(Body);
       let result = await this.authService.login(data);
       if(result.token)
         setCookie(result.token,res) 
       return res.status(200).json({message:result.message,token:result.token});
    }

    @Post("/register")
    @UseBruteForceLimit({blockDuration:60*30,requestLimit:10,timeLimit:60*10,keyType:'LOGIN'})
    async register(@Body()Body:LoginDto) {
         let data = registerSchema.validateSync(Body);
         let result = await this.authService.register(data);
         return result;
    }

    @Get("/verify-email")
    @UseBruteForceLimit({blockDuration:60*30,requestLimit:5,timeLimit:60*10,keyType:'TOKEN',isForError:true})
    async verifyEmail(@Query()Query:{token:string}) {
        let token = Query.token;
        if(!token)
            throw new InvalidInputError("Token is required")
        let result = await this.authService.verifyEmail(token);
        return result;
    }

    @Put("/logout")
    @UseGuards(LoginGuard)
    async logout(@Req()req:AuthorizedRequest,@Res()res:Response) {
        let userId = req.user.userId;
        let token = req.token
        let result = await this.authService.logout(userId,token,res);
        return res.status(200).json({message:result.message});
    }
}
