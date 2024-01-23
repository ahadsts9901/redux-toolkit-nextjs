"use client"

import React, { useEffect } from 'react'
import { v2Theme } from './Mui/client.mjs';
import { ThemeProvider } from '@emotion/react';
import MiniDrawer from './Mui/components/MiniDrawer';
import { useSelector, useDispatch } from 'react-redux';

const page = () => {

  const currentUser = useSelector(state => state.user)

  return (

    <>
      <ThemeProvider theme={v2Theme}>
        <MiniDrawer />
      </ThemeProvider>
    </>

  )
}

export default page