import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

type Severity = 'success' | 'error' | 'warning' | 'info'

type SnackbarContextValue = {
  showSnackbar: (message: string, severity?: Severity, durationMs?: number) => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext)
  if (!ctx) throw new Error('useSnackbar must be used within <SnackbarProvider/>')
  return ctx
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<Severity>('info')
  const [duration, setDuration] = useState<number | null>(3000)

  const showSnackbar = useCallback((msg: string, sev: Severity = 'info', durationMs = 3000) => {
    setMessage(msg)
    setSeverity(sev)
    setDuration(durationMs)
    setOpen(true)
  }, [])

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar])

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration ?? undefined}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </MuiAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}