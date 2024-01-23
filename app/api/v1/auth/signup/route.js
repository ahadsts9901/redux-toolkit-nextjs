import "../../../mongodb.mjs";
import { userModel } from "../../../schema.mjs";
import { NextResponse } from 'next/server';
import { firstNamePattern, lastNamePattern, emailPattern, passwordPattern } from "@/app/core.mjs";
import bcrypt from "bcrypt";

export const POST = async (req, res) => {

    try {

        const { firstName, lastName, email, password } = await req.json();

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json({
                message: `Required parameters missing`
            }, { status: 400 });
        }

        if (!firstNamePattern.test(firstName)) {
            return NextResponse.json({
                message: "First Name must between 2 to 15 characters long",
            }, { status: 400 })
        }

        if (!lastNamePattern.test(lastName)) {
            return NextResponse.json({
                message: "Last Name must between 2 to 15 characters long",
            }, { status: 400 })
        }

        if (!emailPattern.test(email)) {
            return NextResponse.json({
                message: "Email pattern is invalid",
            }, { status: 400 })
        }

        if (!passwordPattern.test(password)) {
            return NextResponse.json({
                message: `Password must be alphanumeric and 8 to 24 characters long`,
            }, { status: 400 })
        }

        const user = await userModel.findOne({ email: email }).exec();

        if (user) {
            return NextResponse.json({
                message: "Email already taken",
            }, { status: 409 });
        }

        // create a user
        const passwordHash = await bcrypt.hash(password, 12)

        const signupResponse = await userModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: passwordHash,
            provider: "google",
            isEmailVerified: false,
        });

        return NextResponse.json({
            message: "Signup successful proceed to email verification",
        })

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "error",
        }, { status: 500 });
    }

};