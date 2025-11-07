import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Stack,
  TablePagination,
  Chip
} from '@mui/material'
import { authFetch } from '../services/auth'

export default function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // 🎯 Load audit logs
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await authFetch('/admin/audit', { method: 'GET' })
        const data = res.data.sort((a, b) => b.id - a.id) // show latest first
        setLogs(data)
        setFilteredLogs(data)
      } catch (err) {
        setError('Failed to load audit logs')
      } finally {
        setLoading(false)
      }
    }
    loadLogs()
  }, [])

  // 🔎 Search filter
  useEffect(() => {
    if (!search) setFilteredLogs(logs)
    else {
      setFilteredLogs(
        logs.filter(log =>
          log.username?.toLowerCase().includes(search.toLowerCase()) ||
          log.action?.toLowerCase().includes(search.toLowerCase()) ||
          log.details?.toLowerCase().includes(search.toLowerCase())
        )
      )
      setPage(0)
    }
  }, [search, logs])

  // 🧭 Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // 🎨 Color coding by action type
  const getActionColor = (action) => {
    if (!action) return 'default'
    const upper = action.toUpperCase()
    if (upper.includes('FAIL') || upper.includes('DELETE')) return 'error'
    if (upper.includes('SUCCESS') || upper.includes('UNLOCK') || upper.includes('ENABLE')) return 'success'
    if (upper.includes('LOGOUT') || upper.includes('DISABLE')) return 'warning'
    if (upper.includes('LOGIN')) return 'info'
    return 'default'
  }

  if (loading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>
  if (error) return <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Audit Logs</Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        View and track all system activities and admin operations
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
        <TextField
          label="Search by user or action"
          variant="outlined"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
      </Stack>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
                {/* Timestamp column removed here */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.username}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        color={getActionColor(log.action)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {filteredLogs.length === 0 && (
        <Typography sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
          No logs found.
        </Typography>
      )}
    </Box>
  )
}
