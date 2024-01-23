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
import { v2Theme } from '@/app/Mui/client.mjs';
import PasswordMUI from '@/app/Mui/components/PasswordMUI';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { emailPattern } from '@/app/core.mjs';
import AlertMUI from '@/app/Mui/components/AlertMUI';
import axios from 'axios';

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

export default function ForgotPassword() {

    const router = useRouter()
    const [clientErrorMessage, setClientErrorMessage] = React.useState(null)
    const [clientSuccessMessage, setClientSuccessMessage] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (event) => {

        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const email = data.get('email')

        if (!emailPattern.test(email)) {
            setClientErrorMessage("Invalid Email")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return;
        }

        try {

            setIsLoading(true)

            const response = await axios.post(`/api/v1/auth/forgot-password`, {
                email: email
            }, { withCredentials: true })

            setIsLoading(false)
            router.push(`/auth/forgot-password-complete?email=${email}`)
            setClientSuccessMessage(response.data.message)
            setTimeout(() => {
                setClientSuccessMessage(null)
            }, 2000)

        } catch (error) {
            console.log(error);
            setIsLoading(false)
            setClientErrorMessage(error.response.data.message)
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
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
                        Forgot Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            style={{
                                marginBottom: "16px",
                            }}
                        />
                        <Box style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, width: "100px" }}
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }}
                                onClick={() => router.back()}
                            >
                                <ArrowBackIos style={{
                                    fontSize: "16px",
                                    marginLeft: "4px"
                                }} />
                                <span style={{
                                    width: "50%",
                                    textAlign: "center",
                                    paddingLeft: "4px"
                                }}
                                >Back</span>
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, width: isLoading ? "150px" : "100px" }}
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                }}
                                disabled={isLoading}
                            >
                                {
                                    isLoading ?
                                        <>
                                            <span style={{
                                                width: "50%",
                                                textAlign: "center",
                                                paddingRight: "4px",
                                                marginRight: "16px"
                                            }}
                                            >Processing</span>
                                            <span className="buttonLoader"></span>
                                        </>
                                        :
                                        <>
                                            <span style={{
                                                width: "50%",
                                                textAlign: "center",
                                                paddingRight: "4px"
                                            }}
                                            >Next</span>
                                            <ArrowForwardIos style={{
                                                fontSize: "16px",
                                                marginRight: "4px"
                                            }} />
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