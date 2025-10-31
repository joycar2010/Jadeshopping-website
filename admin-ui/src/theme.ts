import { createTheme } from '@mui/material/styles'
import { zhCN } from '@mui/material/locale'

const brandPrimary = '#1A936F' // 玉石绿色（品牌主色）
const brandSecondary = '#4ECDC4' // 清新蓝绿（辅助色）
const surface = '#F7FAFC'

const theme = createTheme(
  {
    palette: {
      primary: { main: brandPrimary },
      secondary: { main: brandSecondary },
      error: { main: '#E63946' },
      background: { default: surface, paper: '#FFFFFF' },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily:
        'Inter, "Noto Sans SC", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: surface,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            color: '#111827',
            borderBottom: '1px solid #eee',
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: { minHeight: 64 },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { width: 240 },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: { borderRadius: 10, margin: '2px 8px' },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 700 },
        },
      },
    },
  },
  zhCN,
)

export default theme