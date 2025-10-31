import React, { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Alert from '@mui/material/Alert'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import AdminPermissionPanel from '../../components/AdminPermissionPanel'
import { useSnackbar } from '../../components/SnackbarProvider'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

type ActionLog = {
  id: string
  operator_id: string
  action: string
  target_type: string
  target_id: string
  detail: any
  ip?: string
  created_at: string
}

export default function Logs() {
  const { showSnackbar } = useSnackbar()

  const [rows, setRows] = useState<ActionLog[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // filters
  const [operatorId, setOperatorId] = useState('')
  const [action, setAction] = useState('')
  const [targetType, setTargetType] = useState('')
  const [targetId, setTargetId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  // detail dialog
  const [openDetail, setOpenDetail] = useState(false)
  const [detailJson, setDetailJson] = useState('')
  const [detailObj, setDetailObj] = useState<any>(null)

  // operators catalog for selector
  type OperatorOption = { id: string; username: string; email?: string }
  const [opOptions, setOpOptions] = useState<OperatorOption[]>([])
  const [opLoading, setOpLoading] = useState(false)

  const canRead = useMemo(() => true, [])

  const columns: GridColDef[] = [
    { field: 'created_at', headerName: '时间', minWidth: 180, valueFormatter: ({ value }) => new Date(value as string).toLocaleString() },
    { field: 'operator_id', headerName: '操作员ID', minWidth: 210 },
    { field: 'action', headerName: '操作', minWidth: 160 },
    { field: 'target_type', headerName: '目标类型', minWidth: 120 },
    { field: 'target_id', headerName: '目标ID', minWidth: 220 },
    { field: 'ip', headerName: 'IP', minWidth: 130, valueGetter: (p) => p.row.ip || '-' },
    {
      field: 'detail', headerName: '详情', minWidth: 140, sortable: false, filterable: false, renderCell: (params) => {
        const has = !!params.row.detail
        return (
          <Button size="small" disabled={!has} onClick={() => openDetailDialog(params.row.detail)}>
            {has ? '查看' : '—'}
          </Button>
        )
      }
    }
  ]

  function openDetailDialog(detail: any) {
    try {
      setDetailJson(JSON.stringify(detail, null, 2))
      setDetailObj(detail)
    } catch {
      setDetailJson(String(detail))
      setDetailObj(null)
    }
    setOpenDetail(true)
  }

  async function fetchOperatorCatalog() {
    try {
      setOpLoading(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      const res = await fetch('/admin/api/operators?limit=100', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const list = (json.data ?? []) as OperatorOption[]
      setOpOptions(list)
    } catch (err) {
      // 静默处理，保留手动输入回退
      console.warn('加载操作员目录失败', err)
    } finally {
      setOpLoading(false)
    }
  }

  async function fetchLogs(nextPage = page, nextSize = pageSize) {
    try {
      setLoading(true)
      setError('')
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      const params = new URLSearchParams()
      params.set('page', String(nextPage + 1))
      params.set('limit', String(nextSize))
      if (operatorId.trim()) params.set('operator_id', operatorId.trim())
      if (action.trim()) params.set('action', action.trim())
      if (targetType.trim()) params.set('target_type', targetType.trim())
      if (targetId.trim()) params.set('target_id', targetId.trim())
      if (from) params.set('from', from)
      if (to) params.set('to', to)
      const res = await fetch(`/admin/api/logs/actions?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setRows(json.data ?? [])
      setRowCount(Number(json.total ?? 0))
    } catch (err: any) {
      setError(String(err?.message || err))
    } finally {
      setLoading(false)
    }
  }

  async function onExportCsv() {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      const params = new URLSearchParams()
      if (operatorId.trim()) params.set('operator_id', operatorId.trim())
      if (action.trim()) params.set('action', action.trim())
      if (targetType.trim()) params.set('target_type', targetType.trim())
      if (targetId.trim()) params.set('target_id', targetId.trim())
      if (from) params.set('from', from)
      if (to) params.set('to', to)
      const url = `/admin/api/logs/actions/export?${params.toString()}`
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `operator-logs-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      showSnackbar('导出成功','success')
    } catch (err: any) {
      showSnackbar(`导出失败：${String(err?.message || err)}`,'error')
    }
  }

  useEffect(() => {
    fetchLogs()
    fetchOperatorCatalog()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function formatDateInput(d: Date) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  async function applyQuickRange(days: number) {
    const now = new Date()
    const fromDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    const nextFrom = formatDateInput(fromDate)
    const nextTo = formatDateInput(now)
    setFrom(nextFrom)
    setTo(nextTo)
    setPage(0)
    await fetchLogs(0, pageSize)
  }

  function JsonPretty({ value }: { value: any }) {
    const indent = 2
    function render(v: any, level = 0): React.ReactNode {
      const pad = (n: number) => ' '.repeat(n * indent)
      if (v === null || v === undefined) return <span style={{ color: '#999' }}>{String(v)}</span>
      if (typeof v === 'string') return <span style={{ color: '#1a73e8' }}>&quot;{v}&quot;</span>
      if (typeof v === 'number') return <span style={{ color: '#b80672' }}>{String(v)}</span>
      if (typeof v === 'boolean') return <span style={{ color: '#d35400' }}>{String(v)}</span>
      if (Array.isArray(v)) {
        if (v.length === 0) return <span>[]</span>
        return (
          <>
            [
            {v.map((item, i) => (
              <div key={i} style={{ paddingLeft: 16 }}>
                {render(item, level + 1)}{i < v.length - 1 ? ',' : ''}
              </div>
            ))}
            <div>]</div>
          </>
        )
      }
      if (typeof v === 'object') {
        const entries = Object.entries(v)
        if (!entries.length) return <span>{'{}'}</span>
        return (
          <>
            {'{'}
            {entries.map(([k, val], i) => (
              <div key={k} style={{ paddingLeft: 16 }}>
                <span style={{ color: '#6f42c1' }}>&quot;{k}&quot;</span>
                : {render(val, level + 1)}{i < entries.length - 1 ? ',' : ''}
              </div>
            ))}
            <div>{'}'}</div>
          </>
        )
      }
      return <span>{String(v)}</span>
    }
    return (
      <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7, p: 2, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.04)' }}>
        {render(value)}
      </Box>
    )
  }

  async function copyDetail() {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(detailJson || '')
      } else {
        const ta = document.createElement('textarea')
        ta.value = detailJson || ''
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
      }
      showSnackbar('已复制到剪贴板', 'success')
    } catch (err: any) {
      showSnackbar(`复制失败：${String(err?.message || err)}`, 'error')
    }
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>操作日志</Typography>

      {/* 权限提示 */}
      <AdminPermissionPanel />

      {/* 筛选区 */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="op-selector-label">操作员</InputLabel>
          <Select
            labelId="op-selector-label"
            label="操作员"
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value as string)}
            disabled={opLoading}
          >
            <MenuItem value="">全部</MenuItem>
            {opOptions.map(op => (
              <MenuItem key={op.id} value={op.id}>{op.username}{op.email ? ` (${op.email})` : ''}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="操作" size="small" placeholder="如 user.update" value={action} onChange={(e) => setAction(e.target.value)} sx={{ width: { xs: '100%', sm: 200 } }} />
        <TextField label="目标类型" size="small" placeholder="如 user" value={targetType} onChange={(e) => setTargetType(e.target.value)} sx={{ width: { xs: '100%', sm: 160 } }} />
        <TextField label="目标ID" size="small" value={targetId} onChange={(e) => setTargetId(e.target.value)} sx={{ width: { xs: '100%', sm: 240 } }} />
        <TextField type="date" size="small" label="开始日期" InputLabelProps={{ shrink: true }} value={from} onChange={(e) => setFrom(e.target.value)} />
        <TextField type="date" size="small" label="结束日期" InputLabelProps={{ shrink: true }} value={to} onChange={(e) => setTo(e.target.value)} />
        <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Button variant="text" onClick={() => applyQuickRange(1)}>最近24小时</Button>
          <Button variant="text" onClick={() => applyQuickRange(7)}>最近7天</Button>
        </Stack>
        <Button variant="contained" onClick={() => { setPage(0); fetchLogs(0, pageSize) }}>查询</Button>
        <Button variant="outlined" onClick={() => { setOperatorId(''); setAction(''); setTargetType(''); setTargetId(''); setFrom(''); setTo(''); setPage(0); fetchLogs(0, pageSize) }}>重置</Button>
        <Button variant="outlined" onClick={onExportCsv}>导出 CSV</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>加载失败：{error}</Alert>}

      <Box sx={{ height: { xs: 440, md: 560 } }}>
        <DataGrid
          rows={rows}
          getRowId={(r) => r.id}
          loading={loading}
          columns={columns}
          disableColumnMenu
          paginationMode="server"
          rowCount={rowCount}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(m) => {
            const nextPage = m.page ?? 0
            const nextSize = m.pageSize ?? pageSize
            setPage(nextPage)
            setPageSize(nextSize)
            fetchLogs(nextPage, nextSize)
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>

      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} fullWidth maxWidth="md">
        <DialogTitle>详情</DialogTitle>
        <DialogContent dividers>
          {detailObj !== null ? (
            <JsonPretty value={detailObj} />
          ) : (
            <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7, p: 2, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.04)' }}>
              {detailJson || '—'}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Tooltip title="复制JSON">
            <span>
              <IconButton onClick={copyDetail} disabled={!detailJson}>
                <ContentCopyIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Button onClick={() => setOpenDetail(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}