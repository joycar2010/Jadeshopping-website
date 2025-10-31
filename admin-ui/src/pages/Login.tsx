import React, { useState } from 'react'
import axios from 'axios'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

export default function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/admin/api/auth/login', { username, password })
      const token = res.data?.token
      if (token) {
        localStorage.setItem('admin_token', token)
        window.location.href = '/admin'
      } else {
        setError('登录失败：未返回令牌')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          后台登录
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <TextField
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}