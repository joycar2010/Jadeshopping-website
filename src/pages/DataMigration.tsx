import React, { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { AlertCircle, CheckCircle, Database, RefreshCw, Trash2 } from 'lucide-react'
import { DataMigration } from '../utils/dataMigration'
import { isSupabaseConfigured } from '../lib/supabase'
import { getRecentLogs } from '../lib/logger'
import { toast } from 'sonner'

interface MigrationResult {
  categories: boolean
  users: boolean
  products: boolean
  orders: boolean
  reviews: boolean
  carouselItems: boolean
  announcements: boolean
}

const DataMigrationPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [results, setResults] = useState<MigrationResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [recentLogs, setRecentLogs] = useState(getRecentLogs(15))

  // 支持通过查询参数自动触发迁移（仅用于开发/排查）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const auto = params.get('auto')
    if ((auto === '1' || auto === 'true') && !isRunning) {
      handleRunMigration()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const migrationSteps = [
    { key: 'categories', name: '商品分类', description: '迁移商品分类数据' },
    { key: 'users', name: '用户数据', description: '创建测试用户数据' },
    { key: 'products', name: '商品数据', description: '迁移商品信息和规格' },
    { key: 'orders', name: '订单数据', description: '迁移订单和订单项数据' },
    { key: 'reviews', name: '评论数据', description: '迁移商品评论数据' },
    { key: 'carouselItems', name: '轮播图', description: '迁移首页轮播图数据' },
    { key: 'announcements', name: '公告数据', description: '迁移系统公告数据' }
  ]

  const handleRunMigration = async () => {
    setIsRunning(true)
    setProgress(0)
    setResults(null)

    try {
      if (!isSupabaseConfigured) {
        toast.error('Supabase 未配置，已跳过迁移。请在 .env 设置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY 后重试。')
        return
      }
      toast.info('开始数据迁移...')
      
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      const migrationResults = await DataMigration.runFullMigration()
      
      clearInterval(progressInterval)
      setProgress(100)
      setResults(migrationResults)

      const successCount = Object.values(migrationResults).filter(Boolean).length
      const totalCount = Object.keys(migrationResults).length

      if (successCount === totalCount) {
        toast.success(`数据迁移完成！成功迁移 ${successCount}/${totalCount} 个模块`)
      } else {
        toast.warning(`数据迁移部分完成！成功 ${successCount}/${totalCount} 个模块`)
      }

      // 更新最近日志用于诊断
      setRecentLogs(getRecentLogs(15))
    } catch (error) {
      console.error('数据迁移失败:', error)
      toast.error('数据迁移失败，请检查控制台错误信息')
      setRecentLogs(getRecentLogs(15))
    } finally {
      setIsRunning(false)
    }
  }

  const handleClearData = async () => {
    if (!confirm('确定要清空所有数据吗？此操作不可恢复！')) {
      return
    }

    setIsClearing(true)
    
    try {
      if (!isSupabaseConfigured) {
        toast.error('Supabase 未配置，已跳过清空。请在 .env 设置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY 后重试。')
        return
      }
      toast.info('开始清空数据...')
      const success = await DataMigration.clearAllData()
      
      if (success) {
        toast.success('数据清空完成')
        setResults(null)
      } else {
        toast.error('数据清空失败')
      }
      setRecentLogs(getRecentLogs(15))
    } catch (error) {
      console.error('数据清空失败:', error)
      toast.error('数据清空失败，请检查控制台错误信息')
      setRecentLogs(getRecentLogs(15))
    } finally {
      setIsClearing(false)
    }
  }

  const getStepStatus = (stepKey: string) => {
    if (!results) return 'pending'
    return results[stepKey as keyof MigrationResult] ? 'success' : 'error'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Database className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">成功</Badge>
      case 'error':
        return <Badge variant="destructive">失败</Badge>
      default:
        return <Badge variant="secondary">待执行</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">数据迁移工具</h1>
          <p className="text-gray-600">
            将 Mock 数据迁移到 Supabase 数据库，为系统提供初始数据支持
          </p>
          {!isSupabaseConfigured && (
            <div className="mt-3 p-3 rounded-md border border-red-200 bg-red-50 text-sm text-red-700">
              未检测到 Supabase 配置。请在项目根目录的 .env 中设置 <code>VITE_SUPABASE_URL</code> 与 <code>VITE_SUPABASE_ANON_KEY</code>，然后重启开发服务。
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              迁移操作
            </CardTitle>
            <CardDescription>
              执行数据迁移或清空现有数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={handleRunMigration}
                disabled={!isSupabaseConfigured || isRunning || isClearing}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                {isRunning ? '迁移中...' : '开始迁移'}
              </Button>
              
              <Button
                variant="destructive"
                onClick={handleClearData}
                disabled={!isSupabaseConfigured || isClearing || isRunning}
                className="flex items-center gap-2"
              >
                {isClearing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isClearing ? '清空中...' : '清空数据'}
              </Button>
            </div>

            {/* 进度条 */}
            {isRunning && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>迁移进度</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 迁移步骤 */}
        <Card>
          <CardHeader>
            <CardTitle>迁移步骤</CardTitle>
            <CardDescription>
              数据迁移将按以下顺序执行，确保数据依赖关系正确
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {migrationSteps.map((step, index) => {
                const status = getStepStatus(step.key)
                
                return (
                  <div
                    key={step.key}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                        {index + 1}
                      </div>
                      {getStatusIcon(status)}
                      <div>
                        <h3 className="font-medium text-gray-900">{step.name}</h3>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(status)}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 最近日志（15条） */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>最近日志（15条）</span>
              <Button
                variant="secondary"
                onClick={() => setRecentLogs(getRecentLogs(15))}
                disabled={isRunning || isClearing}
              >刷新日志</Button>
            </CardTitle>
            <CardDescription>
              来自前端日志缓冲；如需更多细节，在 .env 设置 `VITE_DEBUG_LOGS=true`
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <div className="text-sm text-gray-500">暂无日志，请执行迁移或清空操作后查看。</div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-end mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const text = recentLogs.map(l => {
                        const ts = new Date(l.time).toLocaleTimeString()
                        const args = l.args.map(a => {
                          try { return typeof a === 'string' ? a : JSON.stringify(a) } catch { return String(a) }
                        }).join(' ')
                        return `${ts} [${l.level.toUpperCase()}] ${args}`
                      }).join('\n')
                      navigator.clipboard.writeText(text)
                      toast.success('已复制最近 15 条日志到剪贴板')
                    }}
                  >复制日志</Button>
                </div>
                {recentLogs.map((log, idx) => {
                  const levelColor = {
                    info: 'text-blue-600',
                    debug: 'text-gray-600',
                    warn: 'text-yellow-700',
                    error: 'text-red-700',
                    summary: 'text-gray-800'
                  }[log.level]

                  const stringify = (v: any) => {
                    try { return typeof v === 'string' ? v : JSON.stringify(v) } catch { return String(v) }
                  }

                  return (
                    <div key={idx} className="text-sm">
                      <span className="text-gray-400 mr-2">{new Date(log.time).toLocaleTimeString()}</span>
                      <span className={`font-medium mr-2 ${levelColor}`}>[{log.level.toUpperCase()}]</span>
                      <span className="break-words">
                        {log.args.map((a, i) => (
                          <span key={i} className="mr-1">{stringify(a)}</span>
                        ))}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 迁移结果摘要 */}
        {results && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>迁移结果</CardTitle>
              <CardDescription>
                数据迁移执行结果摘要
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(results).map(([key, success]) => {
                  const step = migrationSteps.find(s => s.key === key)
                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-lg border ${
                        success 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">
                          {step?.name || key}
                        </span>
                      </div>
                      <span className={`text-xs ${
                        success ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {success ? '迁移成功' : '迁移失败'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 使用说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-900">1.</span>
                <span>首次使用请点击"开始迁移"按钮，将 Mock 数据迁移到 Supabase 数据库</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-900">2.</span>
                <span>如需重新迁移，请先点击"清空数据"清除现有数据，再执行迁移</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-900">3.</span>
                <span>迁移过程中请勿关闭页面，等待所有步骤完成</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-900">4.</span>
                <span>如遇到错误，请检查浏览器控制台的详细错误信息</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DataMigrationPage