import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

type MePayload = {
  username: string
  roles?: string[]
  permissions?: string[]
}

interface AdminPermissionPanelProps {
  title?: string
}

export default function AdminPermissionPanel({ title = '当前账户权限' }: AdminPermissionPanelProps) {
  const [me, setMe] = useState<MePayload | null>(null)
  const [meError, setMeError] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchMe() {
    setMeError('')
    setLoading(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) {
      setMe(null)
      setMeError('未登录或令牌缺失')
      setLoading(false)
      return
    }
    try {
      const res = await fetch('/admin/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setMe(data.user ?? data ?? null)
    } catch (err: any) {
      setMe(null)
      setMeError(err?.message || '读取当前账户失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMe() }, [])

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      {loading && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CircularProgress size={20} />
          <Typography variant="body2">正在加载当前账户信息…</Typography>
        </Stack>
      )}
      {!loading && meError && <Alert severity="error">{meError}</Alert>}
      {!loading && !meError && me && (
        <Stack spacing={1}>
          <Typography variant="body2">用户名：<b>{me.username}</b></Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <Typography variant="body2" sx={{ mr: 1 }}>角色：</Typography>
            {(me.roles && me.roles.length) ? (
              me.roles.map((r) => <Chip key={r} label={r} size="small" />)
            ) : (
              <Typography variant="body2">无</Typography>
            )}
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <Typography variant="body2" sx={{ mr: 1 }}>权限：</Typography>
            {(me.permissions && me.permissions.length) ? (
              me.permissions.map((p) => <Chip key={p} label={p} size="small" variant="outlined" />)
            ) : (
              <Typography variant="body2">无</Typography>
            )}
          </Stack>
        </Stack>
      )}
    </Paper>
  )
}