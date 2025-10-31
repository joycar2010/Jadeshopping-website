import React, { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import AdminPermissionPanel from '../../components/AdminPermissionPanel'
import { useSnackbar } from '../../components/SnackbarProvider'
import useAlignY from '../../hooks/useAlignY'

type LoginLog = {
  id: string
  user_id: string
  email?: string
  success: boolean
  ip?: string
  created_at: string
}

type User = {
  id: string
  email: string
  name?: string
  member_level?: string
  points?: number
  is_active: boolean
  created_at: string
}

type MePayload = {
  username: string
  roles?: string[]
  permissions?: string[]
}

type OpHistoryItem = {
  key: string
  time: number
  userId: string
  email?: string
  action: 'enable' | 'disable'
}

export default function Users() {
  const { showSnackbar } = useSnackbar()

  // 用户列表状态
  const [list, setList] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<string>('') // '', 'enabled', 'disabled'
  const [page, setPage] = useState(0) // 0-based for DataGrid
  const [pageSize, setPageSize] = useState(10)
  const [rowCount, setRowCount] = useState(0)
  // 行高亮反馈（仅最近一次，按启用/禁用区分颜色）
  const [lastHighlight, setLastHighlight] = useState<{ id: string; kind: 'enable' | 'disable' } | null>(null)
  // 最近操作历史与折叠状态
  const [opHistory, setOpHistory] = useState<OpHistoryItem[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)

  // 权限门控
  const [me, setMe] = useState<MePayload | null>(null)
  const canRead = useMemo(() => !!me?.permissions?.some(p => p === 'users.read' || p === 'users.write'), [me])
  const canWrite = useMemo(() => !!me?.permissions?.includes('users.write'), [me])

  // 编辑对话框
  const [openEdit, setOpenEdit] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [form, setForm] = useState<{ name?: string; member_level?: string; points?: number; is_active?: boolean; email?: string }>({})
  const [saving, setSaving] = useState(false)

  // 登录记录对话框
  const [openLogs, setOpenLogs] = useState(false)
  const [logs, setLogs] = useState<LoginLog[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsPage, setLogsPage] = useState(0)
  const [logsPageSize, setLogsPageSize] = useState(10)
  const [logsRowCount, setLogsRowCount] = useState(0)
  const [logsSuccess, setLogsSuccess] = useState<string>('') // '', 'success', 'failed'
  const [logsFrom, setLogsFrom] = useState<string>('') // YYYY-MM-DD
  const [logsTo, setLogsTo] = useState<string>('')

  // 移除本地权限读取，统一使用共享权限面板组件

  async function fetchUsers(nextPage = page, nextPageSize = pageSize) {
    try {
      setLoading(true)
      setError('')
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      const params = new URLSearchParams()
      if (q && q.trim().length) params.set('q', q.trim())
      if (status) params.set('status', status)
      params.set('page', String(nextPage + 1))
      params.set('limit', String(nextPageSize))
      const res = await fetch(`/admin/api/users?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setList(json.data ?? [])
      setRowCount(Number(json.total ?? 0))
    } catch (err: any) {
      setError(String(err?.message || err))
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(u: User) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      const endpoint = u.is_active ? `/admin/api/users/${u.id}/disable` : `/admin/api/users/${u.id}/enable`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await fetchUsers()
      showSnackbar(`${u.is_active ? '已禁用' : '已启用'}成功`, 'success')
      // 仅高亮最近一次操作行，并按动作区分颜色，2 秒后淡出
      const kind: 'enable' | 'disable' = u.is_active ? 'disable' : 'enable'
      setLastHighlight({ id: u.id, kind })
      // 记录最近操作历史（最多 50 条）
      setOpHistory(prev => [{
        key: `${u.id}-${kind}-${Date.now()}`,
        time: Date.now(),
        userId: u.id,
        email: u.email,
        action: kind,
      }, ...prev].slice(0, 50))
      setTimeout(() => {
        // 避免旧定时器清除较新的高亮
        setLastHighlight((prev) => (prev && prev.id === u.id ? null : prev))
      }, 2000)
    } catch (err: any) {
      showSnackbar(`操作失败：${String(err?.message || err)}`,'error')
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 获取当前管理员权限
  useEffect(() => {
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
        const res = await fetch('/admin/api/me', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (res.ok) {
          const json = await res.json()
          setMe(json.user)
        }
      } catch {}
    })()
  }, [])

  const memberLevelMap: Record<string, string> = {
    bronze: '青铜',
    silver: '白银',
    gold: '黄金',
    platinum: '铂金',
    diamond: '钻石',
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: '邮箱', flex: 1, minWidth: 200 },
    { field: 'name', headerName: '昵称', flex: 1, minWidth: 160, valueGetter: ({ value }) => (value ?? '-') },
    {
      field: 'member_level',
      headerName: '会员等级',
      minWidth: 120,
      valueFormatter: ({ value }) => {
        if (value == null || value === '') return '-'
        const key = String(value).toLowerCase()
        return memberLevelMap[key] ?? String(value)
      },
    },
    { field: 'points', headerName: '积分', minWidth: 100, type: 'number' },
    {
      field: 'is_active',
      headerName: '状态',
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        const v = params.value
        if (v === true) {
          return (
            <div id={`status-anchor-${params.id}`} data-role="status-anchor">
              <Chip label="已启用" size="small" color="success" variant="outlined" />
            </div>
          )
        }
        if (v === false) {
          return (
            <div id={`status-anchor-${params.id}`} data-role="status-anchor">
              <Chip label="已禁用" size="small" color="default" variant="outlined" />
            </div>
          )
        }
        return (
          <div id={`status-anchor-${params.id}`} data-role="status-anchor">
            <Chip label="-" size="small" variant="outlined" />
          </div>
        )
      }
    },
    {
      field: 'actions',
      headerName: '操作',
      minWidth: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const u = params.row as User
        return (
          <AlignActions
            u={u}
            rowId={String(params.id)}
            canWrite={canWrite}
            toggleActive={toggleActive}
            openEditDialog={openEditDialog}
            openLogsDialog={openLogsDialog}
          />
        )
      },
    },
  ]

  type AlignActionsProps = {
    u: User
    rowId: string
    canWrite: boolean
    toggleActive: (u: User) => void
    openEditDialog: (id: string) => void
    openLogsDialog: (id: string) => void
  }

  const AlignActions: React.FC<AlignActionsProps> = ({ u, rowId, canWrite, toggleActive, openEditDialog, openLogsDialog }) => {
    const sourceRef = useRef<HTMLDivElement | null>(null)
    const targetRef = useRef<HTMLDivElement | null>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
      const el = document.getElementById(`status-anchor-${rowId}`) as HTMLDivElement | null
      // 优先以 Chip 内部文字为参照，视觉更贴合“文字基线”
      const inner = el?.querySelector('.MuiChip-label') as HTMLElement | null
      targetRef.current = inner || el
      setReady(!!(inner || el))
    }, [rowId])

    // 以中心线对齐，默认微调 -1px 贴线
    useAlignY(sourceRef, targetRef, { mode: 'center', applyTo: 'source', enabled: ready, offset: -1 })

    return (
      <Stack ref={sourceRef} direction="row" spacing={1} className="v-center-row aligny-adjust">
        <Button
          size="small"
          variant="contained"
          color="success"
          disabled={u.is_active || !canWrite}
          onClick={() => { if (!u.is_active) toggleActive(u) }}
        >
          启用
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="warning"
          disabled={!u.is_active || !canWrite}
          onClick={() => { if (u.is_active) toggleActive(u) }}
        >
          禁用
        </Button>
        <Button size="small" onClick={() => openEditDialog(u.id)}>查看/编辑</Button>
        <Button size="small" onClick={() => openLogsDialog(u.id)}>登录记录</Button>
      </Stack>
    )
  }

  async function openEditDialog(id: string) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      const res = await fetch(`/admin/api/users/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const u = json.data as User
      setCurrentId(id)
      setForm({ name: u.name, member_level: u.member_level, points: u.points, is_active: u.is_active, email: u.email })
      setOpenEdit(true)
    } catch (err: any) {
      showSnackbar(`加载用户信息失败：${String(err?.message || err)}`,'error')
    }
  }

  async function fetchLogs(uid: string, nextPage = logsPage, nextPageSize = logsPageSize) {
    try {
      setLogsLoading(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      const params = new URLSearchParams()
      params.set('page', String(nextPage + 1))
      params.set('limit', String(nextPageSize))
      if (logsSuccess === 'success') params.set('success','true')
      else if (logsSuccess === 'failed') params.set('success','false')
      if (logsFrom) params.set('from', logsFrom)
      if (logsTo) params.set('to', logsTo)
      const res = await fetch(`/admin/api/users/${uid}/logins?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setLogs(json.data ?? [])
      setLogsRowCount(Number(json.total ?? 0))
    } catch (err) {
      // 简易提示即可
      console.error('加载登录记录失败', err)
    } finally {
      setLogsLoading(false)
    }
  }

  async function openLogsDialog(id: string) {
    setCurrentId(id)
    setLogsPage(0)
    await fetchLogs(id, 0, logsPageSize)
    setOpenLogs(true)
  }

  async function saveEdit() {
    if (!currentId) return
    try {
      setSaving(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      const payload: any = {}
      if (typeof form.name === 'string') payload.name = form.name
      if (typeof form.member_level === 'string') payload.member_level = form.member_level
      if (typeof form.points === 'number') payload.points = form.points
      if (typeof form.is_active === 'boolean') payload.is_active = form.is_active
      const res = await fetch(`/admin/api/users/${currentId}`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setOpenEdit(false)
      await fetchUsers()
      showSnackbar('保存成功','success')
    } catch (err: any) {
      showSnackbar(`保存失败：${String(err?.message || err)}`,'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        用户管理
      </Typography>

      {/* 当前账户权限面板（统一样式） */}
      <AdminPermissionPanel />

      {/* 查询条件 */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mb: 2 }}>
        <TextField
          placeholder="按邮箱关键字搜索"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          sx={{ width: { xs: '100%', sm: 280 } }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="user-status-label">状态</InputLabel>
          <Select
            labelId="user-status-label"
            value={status}
            label="状态"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="">全部</MenuItem>
            <MenuItem value="enabled">已启用</MenuItem>
            <MenuItem value="disabled">已禁用</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={() => { setPage(0); fetchUsers(0, pageSize) }} variant="contained">查询</Button>
      </Stack>

      {/* 列表区 */}
      {opHistory.length > 0 && (
        <Box sx={{ mb: 1.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              最近操作 {opHistory.length} 项
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" onClick={() => setHistoryOpen(o => !o)}>
                {historyOpen ? '收起' : '展开'}
              </Button>
              <Button size="small" color="inherit" onClick={() => setOpHistory([])}>清空</Button>
            </Stack>
          </Stack>
          <Collapse in={historyOpen} timeout="auto">
            <Box sx={{ mt: 1, border: '1px solid #eee', borderRadius: 1, p: 1 }}>
              <Stack spacing={0.5}>
                {opHistory.slice(0, 20).map(item => (
                  <Stack key={item.key} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 180 }}>
                      {new Date(item.time).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {item.email || item.userId}
                    </Typography>
                    <Chip size="small" label={item.action === 'enable' ? '启用' : '禁用'} color={item.action === 'enable' ? 'success' : 'warning'} variant="outlined" />
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Collapse>
        </Box>
      )}
      {loading && <Typography sx={{ my: 2 }}>加载中...</Typography>}
      {error && <Alert sx={{ my: 2 }} severity="error">加载失败：{error}</Alert>}
      {!loading && !error && (
        <Box sx={{
          height: { xs: 440, md: 560 },
          '& .row-enabled': {
            animation: 'rowFlashGreen 2s ease-out',
          },
          '& .row-enabled .MuiDataGrid-cell': {
            backgroundColor: 'rgba(76, 175, 80, 0.15)', // 绿色淡色（启用）
          },
          '& .row-disabled': {
            animation: 'rowFlashOrange 2s ease-out',
          },
          '& .row-disabled .MuiDataGrid-cell': {
            backgroundColor: 'rgba(255, 152, 0, 0.15)', // 浅橙色（禁用）
          },
          '@keyframes rowFlashGreen': {
            '0%': { backgroundColor: 'rgba(76, 175, 80, 0.18)' },
            '100%': { backgroundColor: 'transparent' },
          },
          '@keyframes rowFlashOrange': {
            '0%': { backgroundColor: 'rgba(255, 152, 0, 0.2)' },
            '100%': { backgroundColor: 'transparent' },
          },
        }}>
          <DataGrid
            rows={list}
            getRowId={(row) => row.id}
            columns={columns}
            disableColumnMenu
            getRowClassName={(params) => {
              if (lastHighlight?.id === String(params.id)) {
                return lastHighlight.kind === 'enable' ? 'row-enabled' : 'row-disabled'
              }
              return ''
            }}
            paginationMode="server"
            rowCount={rowCount}
            paginationModel={{ pageSize, page }}
            onPaginationModelChange={(m) => {
              const nextPage = m.page ?? 0
              const nextSize = m.pageSize ?? pageSize
              setPage(nextPage)
              setPageSize(nextSize)
              fetchUsers(nextPage, nextSize)
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Box>
      )}

      {/* 权限不足告警 */}
      {me && !canRead && (
        <Alert sx={{ mt: 2 }} severity="warning">您无权查看用户数据（需要 users.read 或 users.write）</Alert>
      )}

      {/* 查看/编辑对话框 */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>查看/编辑用户</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="邮箱" value={form.email || ''} InputProps={{ readOnly: true }} fullWidth />
            <TextField label="昵称" value={form.name || ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth />
            <TextField label="会员等级" value={form.member_level || ''} onChange={(e) => setForm((f) => ({ ...f, member_level: e.target.value }))} fullWidth />
            <TextField label="积分" type="number" value={typeof form.points === 'number' ? form.points : ''} onChange={(e) => setForm((f) => ({ ...f, points: Number(e.target.value) || 0 }))} fullWidth />
            <FormControlLabel control={<Switch checked={!!form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />} label="启用" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>取消</Button>
          <Button onClick={saveEdit} disabled={!canWrite || saving} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>

      {/* 登录记录对话框 */}
      <Dialog open={openLogs} onClose={() => setOpenLogs(false)} fullWidth maxWidth="md">
        <DialogTitle>登录记录</DialogTitle>
        <DialogContent dividers>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="logs-success-label">结果</InputLabel>
              <Select
                labelId="logs-success-label"
                label="结果"
                value={logsSuccess}
                onChange={(e) => setLogsSuccess(e.target.value)}
              >
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="success">成功</MenuItem>
                <MenuItem value="failed">失败</MenuItem>
              </Select>
            </FormControl>
            <TextField
              type="date"
              size="small"
              label="开始日期"
              InputLabelProps={{ shrink: true }}
              value={logsFrom}
              onChange={(e) => setLogsFrom(e.target.value)}
            />
            <TextField
              type="date"
              size="small"
              label="结束日期"
              InputLabelProps={{ shrink: true }}
              value={logsTo}
              onChange={(e) => setLogsTo(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={async () => { if (currentId) await fetchLogs(currentId, 0, logsPageSize); setLogsPage(0) }}
            >
              筛选
            </Button>
          </Stack>
          <Box sx={{ height: 420 }}>
            <DataGrid
              rows={logs}
              getRowId={(r) => r.id}
              loading={logsLoading}
              columns={[
                { field: 'created_at', headerName: '时间', minWidth: 200, valueFormatter: ({ value }) => new Date(value as string).toLocaleString() },
                { field: 'email', headerName: '邮箱', minWidth: 200, valueGetter: ({ value }) => (value ?? '-') },
                { field: 'ip', headerName: 'IP', minWidth: 140, valueGetter: ({ value }) => (value ?? '-') },
                { field: 'success', headerName: '结果', minWidth: 100, valueFormatter: ({ value }) => (value ? '成功' : '失败') },
              ]}
              disableColumnMenu
              paginationMode="server"
              rowCount={logsRowCount}
              paginationModel={{ page: logsPage, pageSize: logsPageSize }}
              onPaginationModelChange={async (m) => {
                const nextPage = m.page ?? 0
                const nextSize = m.pageSize ?? logsPageSize
                setLogsPage(nextPage)
                setLogsPageSize(nextSize)
                if (currentId) await fetchLogs(currentId, nextPage, nextSize)
              }}
              pageSizeOptions={[10, 25, 50]}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogs(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}