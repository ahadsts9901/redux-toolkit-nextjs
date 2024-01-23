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


import { v2Theme } from '../../Mui/client.mjs';
import PasswordMUI from '@/app/Mui/components/PasswordMUI';
import AlertMUI from '@/app/Mui/components/AlertMUI';
// import { ThemeProvider } from '@emotion/react';
import { firstNamePattern, lastNamePattern, emailPattern, passwordPattern } from '@/app/core.mjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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

export default function SignUp() {

    const [password, setPassword] = React.useState("")
    const [repeatPassword, setRepeatPassword] = React.useState("")
    const [clientErrorMessage, setClientErrorMessage] = React.useState(null)
    const [clientSuccessMessage, setClientSuccessMessage] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const router = useRouter()

    const handleSubmit = async (event) => {

        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const firstName = data.get('firstName')
        const lastName = data.get('lastName')
        const email = data.get('email')

        if (!firstNamePattern.test(firstName)) {
            setClientErrorMessage("First Name must between 2 to 15 characters long")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        if (!lastNamePattern.test(lastName)) {
            setClientErrorMessage("Last Name must between 2 to 15 characters long")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        if (!emailPattern.test(email)) {
            setClientErrorMessage("Email pattern is invalid")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        if (!passwordPattern.test(password)) {
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

        const dataToSend = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }

        setIsLoading(true)

        try {
            const response = await axios.post(`/api/v1/auth/signup`, dataToSend, {
                withCredentials: true,
            });

            if (response.data.message !== "error") {

                try {

                    const sendMailResponse = await axios.post(`/api/v1/auth/email-otp`, {
                        email: email
                    }, { withCredentials: true })

                    setIsLoading(false)

                    router.push(`/auth/email-verification?email=${email}`)
                } catch (error) {
                    console.log(error);
                    setIsLoading(false)
                    setClientErrorMessage("An unknown error occured")
                    setTimeout(() => {
                        setClientErrorMessage(null)
                    }, 2000)
                }

            } else {
                setClientErrorMessage("An unknown error occured")
                setTimeout(() => {
                    setClientErrorMessage(null)
                }, 2000)
            }

            setTimeout(() => {
                setClientSuccessMessage(null)
            }, 2000)

        } catch (error) {
            setIsLoading(false)
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

    };

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
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordMUI
                                    name="password"
                                    label="Password * "
                                    onChange={(value) => setPassword(value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordMUI
                                    name="repeatPassword"
                                    label="Repeat Password * "
                                    onChange={(value) => setRepeatPassword(value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="Remember me."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {
                                isLoading ? <span className="buttonLoader"></span> : null
                            }
                            {
                                isLoading ? "Processing" : "Sign Up"
                            }
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/auth/signin" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}