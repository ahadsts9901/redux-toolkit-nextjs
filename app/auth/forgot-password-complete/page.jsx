"use client"

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { theme, v2Theme } from '@/app/Mui/client.mjs';
import PasswordMUI from '@/app/Mui/components/PasswordMUI';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { MuiOtpInput } from 'mui-one-time-password-input'
import AlertMUI from '@/app/Mui/components/AlertMUI';
import { otpPattern, passwordPattern } from '@/app/core.mjs';
import axios from "axios"

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://ahad-web.onrender.com/" style={{
                textDecoration: "none"
            }}>
                We App
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function ForgotPasswordComplete() {

    const router = useRouter()
    const [otp, setOtp] = React.useState('')
    const [clientErrorMessage, setClientErrorMessage] = React.useState(null)
    const [clientSuccessMessage, setClientSuccessMessage] = React.useState(null)
    const [mail, setMail] = React.useState('')
    const [password, setPassword] = React.useState("")
    const [repeatPassword, setRepeatPassword] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    React.useEffect(() => {
        let email = location.href
            .split("?")[1]
            .split("=")[1]
            .split("%40");
        if (email[1]) {
            email = `${email[0]}@${email[1]}`;
            setMail(email)
        } else {
            email = email[0];
            setMail(email)
        }
    }, []);

    const handleChange = async (newValue) => {
        setOtp(newValue)
    }

    const resendOtp = async (email) => {

        try {

            setIsLoading(true)

            const response = await axios.post("/api/v1/auth/forgot-password", {
                email: mail
            }, { withCredentials: true })

            setClientSuccessMessage(response.data.message)
            setTimeout(() => {
                setClientSuccessMessage(null)
            }, 2000);

            setIsLoading(false)

        } catch (error) {
            console.log(error);
            setIsLoading(false)
            setClientErrorMessage(error.response.data.message)
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000);
        }

    }

    const handleSubmit = async (event) => {

        if (!otpPattern.test(otp)) {
            setClientErrorMessage("Invalid otp code")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return;
        }

        if (!passwordPattern.test(password) || !passwordPattern.test(repeatPassword)) {
            setClientErrorMessage("Password must be alphanumeric and 8 to 24 characters long")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        if (password !== repeatPassword) {
            setClientErrorMessage("Passwords do not match")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        try {
            setIsLoading(true)

            const response = await axios.put(`/api/v1/auth/forgot-password-complete`, {
                email: mail,
                otpCode: otp,
                password: password,
            }, { withCredentials: true })

            router.push("/auth/signin")
            setClientSuccessMessage(response.data.message)
            setTimeout(() => {
                setClientSuccessMessage(null)
            }, 2000)

            setIsLoading(false)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
            setClientErrorMessage(error.response.data.message)
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
        }
    }

    return (
        <ThemeProvider theme={v2Theme}>
            {
                clientErrorMessage && <AlertMUI status="error" text={clientErrorMessage} />
            }

            {
                clientSuccessMessage && <AlertMUI status="success" text={clientSuccessMessage} />
            }
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Forgot Password
                    </Typography>
                    <Typography component="p" variant="p" style={{
                        textAlign: "center",
                        marginTop: "16px",
                    }}>
                        Enter 6 digit code sent to: <b>{mail}</b>
                    </Typography>
                    <Box noValidate sx={{ mt: 1, width: "100%" }}>
                        <MuiOtpInput type="number" length={6} value={otp} onChange={handleChange}
                            style={{
                                margin: "32px 0",
                            }}
                        />
                        <PasswordMUI
                            label="New Password * "
                            onChange={(value) => setPassword(value)}
                            name="password"
                        />
                        <div className='p-[8px]'></div>
                        <PasswordMUI
                            label="Repeat New Password * "
                            onChange={(value) => setRepeatPassword(value)}
                            name="password"
                        />
                        <Typography component="p" variant="p"
                            style={{
                                color: theme.palette.text.primary,
                                textDecoration: "underline",
                                textDecorationColor: theme.palette.text.primary,
                                cursor: "pointer",
                                marginTop: "16px",
                                textAlign: "right",
                            }}
                            onClick={() => {
                                resendOtp(mail)
                            }}
                        >Resend OTP</Typography>
                        <Box style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, width: "100%" }}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {
                                    isLoading ?
                                        <>
                                            <span className="buttonLoader"></span>
                                            <span style={{
                                                textAlign: "center",
                                                paddingLeft: "4px"
                                            }}
                                            >Processing</span>
                                        </>
                                        :
                                        <>
                                            <span style={{
                                                width: "100%",
                                                textAlign: "center",
                                                paddingLeft: "4px"
                                            }}
                                            >Update Password</span>
                                        </>
                                }
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}