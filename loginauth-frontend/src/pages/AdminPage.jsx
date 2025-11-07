import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableHead, TableBody, TableRow,
  TableCell, Paper, TableContainer, CircularProgress, Alert, Button, Stack
} from '@mui/material'
import { authFetch } from '../services/auth'
import { getCurrentUser } from '../services/auth'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = getCurrentUser()

  const loadUsers = async () => {
    try {
      const res = await authFetch('/admin/users', { method: 'GET' })
      setUsers(res.data)
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleToggleEnabled = async (id) => {
    await authFetch(`/admin/users/${id}/toggle-enabled`, { method: 'PUT' })
    loadUsers()
  }

  const handleUnlock = async (id) => {
    await authFetch(`/admin/users/${id}/unlock`, { method: 'PUT' })
    loadUsers()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await authFetch(`/admin/users/${id}`, { method: 'DELETE' })
      loadUsers()
    }
  }

  if (loading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>
  if (error) return <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Logged in as: {user?.username} ({user?.roles.join(', ')})
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Account Locked</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.roles?.join(', ')}</TableCell>
                <TableCell>{u.enabled ? '✅' : '🚫'}</TableCell>
                <TableCell>{u.accountNonLocked ? '✅' : '🔒'}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      size="small"
                      variant="contained"
                      color={u.enabled ? 'warning' : 'success'}
                      onClick={() => handleToggleEnabled(u.id)}
                    >
                      {u.enabled ? '🚫 Disable' : '✅ Enable'}
                    </Button>

                    {!u.accountNonLocked && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleUnlock(u.id)}
                      >
                        🔓 Unlock
                      </Button>
                    )}

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(u.id)}
                    >
                      🗑️ Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
