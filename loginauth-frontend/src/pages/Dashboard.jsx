import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { getCurrentUser } from '../services/auth'

export default function Dashboard() {
  const user = getCurrentUser()
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Welcome {user?.username || 'guest'}</Typography>
      <Typography variant="body1">Role: {user?.roles?.join(', ')}</Typography>
    </Box>
  )
}
