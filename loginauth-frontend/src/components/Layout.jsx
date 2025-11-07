import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../services/auth'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* 🔰 App Title */}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                color: 'inherit',
                textDecoration: 'none',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}
            >
              LoginAuth
            </Typography>

            {/* 👤 If user is logged in */}
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 500 }}>{user.username}</Typography>

                {/* 👑 Admin options */}
                {user.roles.includes('ROLE_ADMIN') && (
                  <>
                    <Button color="inherit" component={RouterLink} to="/admin">
                      Admin
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/admin/audit">
                      Audit Logs
                    </Button>
                  </>
                )}

                {/* 🚪 Logout */}
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            ) : (
              // 🚀 Guest mode: show login/register
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Register
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* 🧱 Page content */}
      <Box sx={{ py: 4, minHeight: 'calc(100vh - 64px)', backgroundColor: '#fafafa' }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </>
  )
}
