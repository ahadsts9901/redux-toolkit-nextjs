import "../../../mongodb.mjs"
import { NextResponse } from "next/server"
import { otpPattern, emailPattern, otpModelEmail, userModel, otpModelPassword } from "../../../schema.mjs"
import moment from "moment"
import bcrypt from "bcrypt"
import { passwordPattern } from "@/app/core.mjs"

export const PUT = async (req, res) => {

    const { email, otpCode, password } = await req.json()

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

    if (!password) {
        return NextResponse.json({
            message: "Password is required",
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

    if (!passwordPattern.test(password)) {
        return NextResponse.json({
            message: `Password must be alphanumeric and 8 to 24 characters long`,
        }, { status: 400 })
    }

    try {

        const result = await otpModelPassword.findOne({ email: email.toLowerCase() })
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

        const passwordHash = await bcrypt.hash(password, 12)

        const response = await userModel
            .findOneAndUpdate(
                { email: email.toLowerCase() },
                { password: passwordHash })

        return NextResponse.json({
            message: "Password updated successfully",
        })


    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "error"
        }, { status: 500 })
    }

}