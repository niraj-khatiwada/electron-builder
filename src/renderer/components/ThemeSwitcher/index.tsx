import { Button, cn, Tooltip } from '@heroui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import { THEME_STORAGE_KEY } from '~/constants'

import Icon from '../Icon'

interface ThemeSwitcherProps extends React.ComponentPropsWithoutRef<'button'> {
  duration?: number
}

type ThemeMode = 'dark' | 'light'

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'

  const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
  if (stored === 'dark' || stored === 'light') return stored

  const domTheme = document.documentElement.dataset.theme as ThemeMode
  if (domTheme === 'dark' || domTheme === 'light') return domTheme

  return 'dark'
}

export const ThemeSwitcher = ({ className, duration = 400 }: ThemeSwitcherProps) => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const handleThemeToggle = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const vw = window.visualViewport?.width ?? window.innerWidth
    const vh = window.visualViewport?.height ?? window.innerHeight

    const maxRadius = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y))

    const applyTheme = () => {
      setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }

    if (typeof document.startViewTransition !== 'function') {
      applyTheme()
      return
    }

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme)
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`]
        },
        {
          duration,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
  }, [duration])

  return (
    <Button
      isIconOnly
      size="sm"
      type="button"
      ref={buttonRef}
      className={cn(className)}
      onPress={handleThemeToggle}
      variant="ghost"
    >
      <Tooltip aria-label="Toggle theme" shouldCloseOnPress>
        <Tooltip.Trigger>
          <Icon name={theme === 'light' ? 'moon' : 'sun'} />
        </Tooltip.Trigger>
        <Tooltip.Content>Toggle theme</Tooltip.Content>
      </Tooltip>
    </Button>
  )
}
