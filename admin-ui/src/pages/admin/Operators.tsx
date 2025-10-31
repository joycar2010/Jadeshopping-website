import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import AdminPermissionPanel from '../../components/AdminPermissionPanel'
import { useSnackbar } from '../../components/SnackbarProvider'

type Operator = {
  id: string
  username: string
  email?: string
  is_active: boolean
  created_at: string
}

type Role = {
  id: string
  name: string
  description?: string
  is_active: boolean
}

type LoginLog = {
  id: string
  operator_id: string
  username: string
  success: boolean
  ip?: string
  created_at: string
}

export default function Operators() {
  const { showSnackbar } = useSnackbar()
  const [list, setList] = useState<Operator[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'all'|'enabled'|'disabled'>('all')
  const [logs, setLogs] = useState<LoginLog[]>([])
  const [logsFor, setLogsFor] = useState<string>('')
  const [logsLoading, setLogsLoading] = useState(false)
  const [newOp, setNewOp] = useState({ username: '', email: '', password: '', is_active: true })
  const [editingId, setEditingId] = useState<string>('')
  const [editData, setEditData] = useState<Partial<Operator>>({})
  const [rolesCatalog, setRolesCatalog] = useState<Role[]>([])
  const [rowRoles, setRowRoles] = useState<Record<string, string[]>>({})
  const [rolesError, setRolesError] = useState('')
  // 权限面板通过共享组件统一展示

  async function fetchOperators() {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('admin_token')
      const res = await axios.get('/admin/api/operators', {
        params: { q: q || undefined, status: status === 'all' ? undefined : status, limit: 20 },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      setList(res.data?.data || [])
    } catch (err: any) {
      setError(err?.response?.data?.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOperators(); fetchRolesCatalog() }, [])

  async function fetchRolesCatalog() {
    setRolesError('')
    try {
      const token = localStorage.getItem('admin_token')
      const res = await axios.get('/admin/api/operators/roles', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      setRolesCatalog(res.data?.data || [])
    } catch (err: any) {
      setRolesError(err?.response?.data?.message || '加载角色失败')
    }
  }


  async function toggleActive(op: Operator, active: boolean) {
    const token = localStorage.getItem('admin_token')
    try {
      await axios.post(`/admin/api/operators/${op.id}/${active ? 'enable' : 'disable'}`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      await fetchOperators()
      showSnackbar(`${active ? '启用' : '禁用'}成功`, 'success')
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || '操作失败', 'error')
    }
  }

  async function viewLogs(op: Operator) {
    setLogsFor(op.id)
    setLogs([])
    setLogsLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await axios.get(`/admin/api/operators/${op.id}/logins`, {
        params: { limit: 5 },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      setLogs(res.data?.data || [])
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || '加载日志失败', 'error')
    } finally {
      setLogsLoading(false)
    }
  }

  async function createOperator() {
    if (!newOp.username || !newOp.password) {
      showSnackbar('请填写用户名与密码', 'warning')
      return
    }
    try {
      const token = localStorage.getItem('admin_token')
      await axios.post('/admin/api/operators', newOp, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      setNewOp({ username: '', email: '', password: '', is_active: true })
      await fetchOperators()
      showSnackbar('创建成功', 'success')
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || '创建失败', 'error')
    }
  }

  async function resetPassword(op: Operator) {
    const pwd = window.prompt(`为操作员 ${op.username} 设置新密码：`, '')
    if (!pwd) return
    try {
      const token = localStorage.getItem('admin_token')
      await axios.post(`/admin/api/operators/${op.id}/reset_password`, { newPassword: pwd }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      showSnackbar('重置成功', 'success')
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || '重置失败', 'error')
    }
  }

  function startEdit(op: Operator) {
    setEditingId(op.id)
    setEditData({ username: op.username, email: op.email, is_active: op.is_active })
    loadOperatorRoles(op.id)
  }

  function cancelEdit() {
    setEditingId('')
    setEditData({})
  }

  async function loadOperatorRoles(opId: string) {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await axios.get(`/admin/api/operators/${opId}/roles`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const roles: string[] = res.data?.roles || []
      setRowRoles(prev => ({ ...prev, [opId]: roles }))
    } catch (err: any) {
      console.warn('加载操作员角色失败', err?.response?.data?.message || err?.message || err)
    }
  }

  function toggleRowRole(opId: string, roleName: string, checked: boolean) {
    setRowRoles(prev => {
      const curr = new Set(prev[opId] || [])
      if (checked) curr.add(roleName)
      else curr.delete(roleName)
      return { ...prev, [opId]: Array.from(curr) }
    })
  }

  async function saveEdit() {
    if (!editingId) return
    try {
      const token = localStorage.getItem('admin_token')
      await axios.put(`/admin/api/operators/${editingId}`, editData, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      // 同步提交角色分配（覆盖式）
      const selectedRoles = rowRoles[editingId] || []
      await axios.post(`/admin/api/operators/${editingId}/roles`, { roles: selectedRoles }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      cancelEdit()
      await fetchOperators()
      showSnackbar('保存成功', 'success')
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || '保存失败', 'error')
    }
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>后台操作员管理</Typography>
      {/* 当前账户权限面板（统一样式） */}
      <AdminPermissionPanel />

      {/* 创建操作员 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>创建操作员</Typography>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <TextField placeholder="用户名" value={newOp.username} onChange={e => setNewOp({ ...newOp, username: e.target.value })} size="small" />
          <TextField placeholder="邮箱(可选)" value={newOp.email} onChange={e => setNewOp({ ...newOp, email: e.target.value })} size="small" />
          <TextField placeholder="初始密码" type="password" value={newOp.password} onChange={e => setNewOp({ ...newOp, password: e.target.value })} size="small" />
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Checkbox checked={newOp.is_active} onChange={e => setNewOp({ ...newOp, is_active: e.target.checked })} />
            <Typography variant="body2">启用</Typography>
          </Stack>
          <Button onClick={createOperator} variant="contained">创建</Button>
        </Stack>
      </Paper>

      {/* 查询条件 */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <TextField placeholder="按用户名或邮箱搜索" value={q} onChange={e => setQ(e.target.value)} size="small" sx={{ width: 280 }} />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="op-status-label">状态</InputLabel>
          <Select labelId="op-status-label" value={status} label="状态" onChange={(e) => setStatus(e.target.value as any)}>
            <MenuItem value="all">全部</MenuItem>
            <MenuItem value="enabled">启用</MenuItem>
            <MenuItem value="disabled">禁用</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={fetchOperators} variant="contained" disabled={loading}>{loading ? '加载中...' : '查询'}</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* 操作员列表 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>用户名</TableCell>
              <TableCell>邮箱</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>角色</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(op => (
              <TableRow key={op.id} hover>
                <TableCell>
                  {editingId === op.id ? (
                    <TextField value={editData.username || ''} onChange={e => setEditData({ ...editData, username: e.target.value })} size="small" />
                  ) : (
                    op.username
                  )}
                </TableCell>
                <TableCell>
                  {editingId === op.id ? (
                    <TextField value={editData.email || ''} onChange={e => setEditData({ ...editData, email: e.target.value })} size="small" />
                  ) : (
                    op.email || '-'
                  )}
                </TableCell>
                <TableCell>
                  {editingId === op.id ? (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Checkbox checked={!!editData.is_active} onChange={e => setEditData({ ...editData, is_active: e.target.checked })} />
                      <Typography variant="body2">启用</Typography>
                    </Stack>
                  ) : (
                    op.is_active ? <Chip label="启用" size="small" color="success" variant="outlined" /> : <Chip label="禁用" size="small" color="default" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  {editingId === op.id ? (
                    rolesCatalog.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">{rolesError || '无可分配角色'}</Typography>
                    ) : (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {rolesCatalog.map(r => (
                          <Stack key={r.id} direction="row" alignItems="center" spacing={0.5} sx={{ border: '1px solid #eee', borderRadius: 1, px: 1 }}>
                            <Checkbox
                              checked={(rowRoles[op.id] || []).includes(r.name)}
                              onChange={e => toggleRowRole(op.id, r.name, e.target.checked)}
                              size="small"
                            />
                            <Typography variant="body2">{r.name}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    )
                  ) : (
                    (rowRoles[op.id] || []).length ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {(rowRoles[op.id] || []).map(name => <Chip key={name} label={name} size="small" />)}
                      </Stack>
                    ) : (
                      <Typography variant="body2">—</Typography>
                    )
                  )}
                </TableCell>
                <TableCell>{new Date(op.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  {editingId === op.id ? (
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" onClick={saveEdit}>保存</Button>
                      <Button size="small" variant="outlined" onClick={cancelEdit}>取消</Button>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      {op.is_active ? (
                        <Button size="small" variant="outlined" onClick={() => toggleActive(op, false)}>禁用</Button>
                      ) : (
                        <Button size="small" variant="contained" onClick={() => toggleActive(op, true)}>启用</Button>
                      )}
                      <Button size="small" variant="outlined" onClick={() => startEdit(op)}>编辑</Button>
                      <Button size="small" variant="outlined" onClick={() => resetPassword(op)}>重置密码</Button>
                      <Button size="small" variant="outlined" onClick={() => viewLogs(op)}>登录日志</Button>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 登录日志 */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>登录日志 {logsFor ? `(操作员ID: ${logsFor})` : ''}</Typography>
        {logsLoading ? (
          <Typography variant="body2">加载中...</Typography>
        ) : (
          logs.length === 0 ? (
            <Typography variant="body2">暂无登录日志</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>时间</TableCell>
                    <TableCell>用户名</TableCell>
                    <TableCell>结果</TableCell>
                    <TableCell>IP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map(l => (
                    <TableRow key={l.id}>
                      <TableCell>{new Date(l.created_at).toLocaleString()}</TableCell>
                      <TableCell>{l.username}</TableCell>
                      <TableCell>{l.success ? '成功' : '失败'}</TableCell>
                      <TableCell>{l.ip || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}
      </Paper>
    </Box>
  )
}