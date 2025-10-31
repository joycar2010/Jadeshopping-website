import { MutableRefObject, useEffect } from 'react'

/**
 * useAlignY 使用说明与示例
 * 
 * 目标：让两个元素在垂直方向（顶/中/底）精确对齐（±1px），并在窗口尺寸、内容尺寸变化时保持对齐。
 * 原理：通过 JS 计算两元素的相对位置差，设置 CSS 变量 --aligny-dy，并由全局类 .aligny-adjust 进行 translateY 位移。
 * 优点：不改变文档流，不影响交互命中区域与层级，可叠加现有布局（Flex/Grid/MUI Stack 等）。
 * 依赖：全局样式 admin-ui/src/styles.css 中的 .aligny-adjust。
 *
 * 基本用法（MUI 示例）：
 *
 *   import { useRef } from 'react'
 *   import useAlignY from '@/hooks/useAlignY'
 *   import { Stack, Button, Avatar } from '@mui/material'
 *
 *   function Example() {
 *     const aRef = useRef<HTMLDivElement | null>(null)   // 需要被移动的元素容器
 *     const bRef = useRef<HTMLDivElement | null>(null)   // 参照物
 *
 *     useAlignY(aRef, bRef, { mode: 'center', applyTo: 'source' })
 *
 *     return (
 *       <Stack direction="row" spacing={2} alignItems="flex-start">
 *         <div ref={bRef}>
 *           <Avatar alt="User" src="/avatar.png" />
 *         </div>
 *         <div ref={aRef} className="aligny-adjust">
 *           <Button size="small" variant="contained">操作</Button>
 *         </div>
 *       </Stack>
 *     )
 *   }
 *
 * 原生用法（同父或不同父容器均可）：
 *
 *   const sourceRef = useRef<HTMLDivElement | null>(null)
 *   const targetRef = useRef<HTMLDivElement | null>(null)
 *   useAlignY(sourceRef, targetRef, { mode: 'bottom', offset: -2 })
 *   return (
 *     <div className="wrapper">
 *       <div id="target" ref={targetRef}>参照元素</div>
 *       <div id="source" ref={sourceRef} className="aligny-adjust">对齐元素</div>
 *     </div>
 *   )
 *
 * 参数建议：
 * - mode: 'top'|'center'|'bottom'（默认 'center'）选择要对齐的基准线。
 * - applyTo: 'source'|'target'（默认 'source'）设置位移施加到哪个元素。
 * - offset: 额外像素位移（默认 0），正数向下、负数向上，用于微调贴线到 ±1px。
 * - enabled: 可按场景开关；skipWhenZero: 当任一元素高度为 0 时跳过（默认 true）。
 *
 * 验收与调试：
 * - 在浏览器 DevTools 中勾勒两元素的 top/bottom/center 线，确认差值 ≤ 1px。
 * - 变更窗口宽高、切换语言/字体、数据加载后重排，确认仍然稳定。
 * - 保持元素交互正常：由于仅是 transform 位移，hover/click 命中区域不会错位。
 */

type AlignMode = 'top' | 'center' | 'bottom'

export type UseAlignYOptions = {
  mode?: AlignMode
  /** 将位移应用到哪个元素，默认 source */
  applyTo?: 'source' | 'target'
  /** 额外偏移量（像素），正数向下，负数向上 */
  offset?: number
  /** 是否启用，默认启用 */
  enabled?: boolean
  /** 当对齐对象不可见/大小为0时是否跳过，默认 true */
  skipWhenZero?: boolean
}

/**
 * 让 sourceRef 与 targetRef 在垂直方向上精确对齐（顶/中/底），误差控制在 ±1px。
 * 通过设置 CSS 变量 --aligny-dy 实现，不破坏原有布局与交互。
 */
export function useAlignY(
  sourceRef: MutableRefObject<HTMLElement | null>,
  targetRef: MutableRefObject<HTMLElement | null>,
  options: UseAlignYOptions = {},
) {
  const {
    mode = 'center',
    applyTo = 'source',
    offset = 0,
    enabled = true,
    skipWhenZero = true,
  } = options

  useEffect(() => {
    const source = sourceRef.current
    const target = targetRef.current
    if (!source || !target) return

    let raf = 0
    let roSource: ResizeObserver | null = null
    let roTarget: ResizeObserver | null = null

    const applyEl = applyTo === 'source' ? source : target

    function measureAndApply() {
      if (!enabled) {
        applyEl.style.removeProperty('--aligny-dy')
        return
      }
      const sr = source.getBoundingClientRect()
      const tr = target.getBoundingClientRect()
      if (skipWhenZero && (sr.height === 0 || tr.height === 0)) {
        applyEl.style.setProperty('--aligny-dy', '0px')
        return
      }
      let delta = 0
      switch (mode) {
        case 'top':
          delta = tr.top - sr.top
          break
        case 'bottom':
          delta = tr.bottom - sr.bottom
          break
        case 'center':
        default:
          delta = (tr.top + tr.height / 2) - (sr.top + sr.height / 2)
          break
      }
      // 加上额外偏移
      delta += offset
      // 四舍五入，控制在 ±1px 内并避免子像素抖动
      const rounded = Math.round(delta)
      applyEl.style.setProperty('--aligny-dy', `${rounded}px`)
    }

    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measureAndApply)
    }

    // 初次与后续监听
    schedule()
    roSource = new ResizeObserver(schedule)
    roTarget = new ResizeObserver(schedule)
    roSource.observe(source)
    roTarget.observe(target)
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      applyEl.style.removeProperty('--aligny-dy')
      roSource?.disconnect()
      roTarget?.disconnect()
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
    }
  }, [sourceRef, targetRef, mode, applyTo, offset, enabled, skipWhenZero])
}

export default useAlignY