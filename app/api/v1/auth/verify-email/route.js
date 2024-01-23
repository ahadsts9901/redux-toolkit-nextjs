import "../../../mongodb.mjs"
import { NextResponse } from "next/server"
import { otpPattern, emailPattern, otpModelEmail, userModel, extendedSessionInDays, initialSessionInDays } from "../../../schema.mjs"
import moment from "moment"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const PUT = async (req, res) => {

    const { email, otpCode } = await req.json()

    if (!email) {
        return NextResponse.json({
            message: "Email is required",
        }, { status: 400 })
    }

    if (!otpCode) {
        return NextResponse.json({
            message: "Otp code is required",
        }, { status: 400 })
    }

    if (!emailPattern.test(email.toLowerCase())) {
        return NextResponse.json({
            message: "Invalid email",
        }, { status: 400 })
    }

    if (!otpPattern.test(otpCode)) {
        return NextResponse.json({
            message: "Invalid otp code",
        }, { status: 400 })
    }

    try {

        const result = await otpModelEmail.findOne({ email: email.toLowerCase() })
            .sort({ _id: -1 }).exec()

        if (!result) {
            return NextResponse.json({
                message: "Invalid otp code",
            }, { status: 400 })
        }

        // if otp code expired
        const isExpired = moment().isAfter(moment(result.createdOn).add(15, 'minutes'));

        if (isExpired) {
            return NextResponse.json({
                message: "Invalid otp code",
            }, { status: 400 })
        }

        if (result.isUsed) {
            return NextResponse.json({
                message: "Invalid otp code",
            }, { status: 400 })
        }

        const isOtpValid = await bcrypt.compare(otpCode, result.otpCodeHash)

        if (!isOtpValid) {
            return NextResponse.json({
                message: "Invalid otp code",
            }, { status: 400 })
        }

        result.isUsed = true
        await result.save()

        // update user in database

        const user = await userModel.findOne({ email: email.toLowerCase() }).exec()
        user.isEmailVerified = true
        await user.save()

        // generate tokens
        const hartRef = jwt.sign({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePhoto: user.profilePhoto,
            _id: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: extendedSessionInDays * 24 * 60 * 60 * 1000,
        });

        const hart = jwt.sign({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePhoto: user.profilePhoto,
            _id: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: initialSessionInDays * 24 * 60 * 60 * 1000,
        });

        const response = NextResponse.json({
            message: "Signup successfull"
        });

        response.cookies.set('hartRef', hartRef, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + extendedSessionInDays * 24 * 60 * 60 * 1000)
        });

        response.cookies.set('hart', hart, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + initialSessionInDays * 24 * 60 * 60 * 1000)
        });

        return response;

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "error"
        }, { status: 500 })
    }

}