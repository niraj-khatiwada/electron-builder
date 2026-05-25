import { useEffect, useState } from 'react'

type WindowSize = {
  width: number
  height: number
}

function getWindowSize(): WindowSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(() => getWindowSize())

  useEffect(() => {
    const root = document.documentElement

    if (!root) return

    const update = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    update()

    const observer = new ResizeObserver(() => {
      update()
    })

    observer.observe(root)

    return () => {
      observer.disconnect()
    }
  }, [])

  return size
}
