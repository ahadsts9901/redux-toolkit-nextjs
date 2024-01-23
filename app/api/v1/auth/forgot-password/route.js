import "../../../mongodb.mjs";
import { userModel, otpModelPassword } from "../../../schema.mjs"
import bcrypt from "bcrypt";
import { emailPattern } from "../../../schema.mjs";
import otpGenerator from "otp-generator"
import { sendEmail } from "@/app/api/functions.mjs";
import { NextResponse } from "next/server";
import moment from "moment";

export const POST = async (req, res) => {

    try {

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({
                message: `Email is required`
            }, { status: 400 });
        }

        if (!emailPattern.test(email)) {
            return NextResponse.json({
                message: "Email pattern is invalid",
            }, { status: 400 })
        }

        const user = await userModel.findOne({ email: email }).exec();

        if (!user) {
            return NextResponse.json({
                message: "Account not found",
            }, { status: 404 });
        }

        if (user.isDisabled) {
            return NextResponse.json({
                message: "Account is disabled",
            }, { status: 400 })
        }

        if (user.isSuspended) {
            return NextResponse.json({
                message: "Account is suspended",
            }, { status: 400 })
        }

        if (!user.isEmailVerified) {
            return NextResponse.json({
                message: "Email is not verified",
            }, { status: 400 })
        }

        // get otp for opt time based throttling
        const otp = await otpModelPassword
            .find({
                email: email,
                createdOn: {
                    $gte: moment().subtract(24, 'hours').toDate()
                }
            })
            .sort({ _id: -1 })
            .limit(3)
            .exec();

        // time based throttling criteria
        // 1st otp: No delay.
        // 2nd otp: 5 minutes delay.
        // 3rd otp: 1 hour delay.
        // 4th otp: 24 hours delay.

        // if three otp created within 24hr
        if (otp?.length >= 3) {
            return NextResponse.json({
                message: "OTP send limit exceed, try again in 24 hours",
            }, { status: 400 })
            // if two otp created within 24hr
        } else if (otp?.length === 2) {
            // it should be older than 60 minutes
            if (moment().diff(moment(otp[0].createdOn), 'minutes') <= 60) {
                return NextResponse.json({
                    message: "OTP send limit exceed, try again in 60 minutes",
                }, { status: 400 })
            }
            // if only one otp created within 24hr
        } else if (otp?.length === 1) {
            // it should be older than 5 minutes
            if (moment().diff(moment(otp[0].createdOn), 'minutes') <= 5) {
                return NextResponse.json({
                    message: "OTP send limit exceed, try again in 5 minutes",
                }, { status: 400 })
            }
        }

        // generate otp code
        const otpCode = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        const otpCodeHash = await bcrypt.hash(otpCode, 12);

        // save otp code to database
        const otpResponse = await otpModelPassword.create({
            email: email,
            otpCodeHash: otpCodeHash,
        });

        // send email
        await sendEmail(
            user.email,
            user.firstName,
            `Hi ${user.firstName}! update your password`,
            `Hi ${user.firstName}! here is your forgot password OTP code. This code is valid for 15 minutes. <h2>${otpCode}</h2>`
        );

        return NextResponse.json({
            message: "OTP code has sent"
        })

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "error",
        }, { status: 500 });
    }

};