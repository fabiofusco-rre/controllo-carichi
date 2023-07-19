import React from 'react'
import { CircularProgress, Stack, Typography } from '@mui/material'

export default function LoaderScreen() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}>
      <Stack spacing={2}
        justifyContent='center'
        alignItems='center'>
        <Typography variant='h5'>Caricamento in corso</Typography>
        <CircularProgress />
      </Stack>
    </div>
  )
}
