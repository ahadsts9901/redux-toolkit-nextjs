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
import AlertMUI from '@/app/Mui/components/AlertMUI';
import { emailPattern, passwordPattern } from '@/app/core.mjs';
import axios from "axios"
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux"
import { login } from "../../redux/user"

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

export default function SignIn() {

  const [password, setPassword] = React.useState("")
  const [clientErrorMessage, setClientErrorMessage] = React.useState(null)
  const [clientSuccessMessage, setClientSuccessMessage] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const router = useRouter()
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email')

    if (!emailPattern.test(email) || !passwordPattern.test(password)) {
      setClientErrorMessage("Email or Password incorrect")
      setTimeout(() => {
        setClientErrorMessage(null)
      }, 2000)
      return
    }

    try {

      setIsLoading(true)

      const response = await axios.post("/api/v1/auth/signin", {
        email: email,
        password: password,
      }, { withCredentials: true })

      setIsLoading(false)
      setClientSuccessMessage(response.data.message)
      dispatch(login(response.data.data))
      setTimeout(() => {
        setClientSuccessMessage(null)
        router.push("/")
      }, 2000);

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
            Sign in
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
            <PasswordMUI
              label="Password * "
              onChange={(value) => setPassword(value)}
              name="password"
            />
            <FormControlLabel style={{
              marginTop: "16px"
            }}
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {
                isLoading ?
                  <>
                    <span className="buttonLoader"></span>
                    Processing
                  </>
                  : "Sign In"
              }
            </Button>
            <Grid container>
              <Grid item xs style={{ marginRight: "16px" }}>
                <Link href="/auth/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/auth/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}