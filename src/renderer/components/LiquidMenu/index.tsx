import { Frame as FrameT } from '@liquid-dom/core/layout'
import {
  Frame,
  Glass,
  GlassContainer,
  Html,
  LiquidCanvas,
  Easing,
  easing,
  spring,
  Transform,
  ZStack,
  Padding,
  AnimationConfigProvider
} from '@liquid-dom/react'
import { type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import styles from './index.module.css'

const BUTTON_SIZE = 40
const CLOSED_MENU_SIZE = 40
const CLOSED_MENU_RADIUS = 130
const CLOSED_MENU_CONTENT_BLUR = 8
const CLOSED_MENU_CONTENT_SCALE = 2
const MENU_WIDTH = 320
const MENU_HEIGHT = 360
const OPEN_MENU_RADIUS = 70
const OPEN_MENU_CONTENT_BLUR = 0
const MENU_ORIGIN = BUTTON_SIZE / 2
const STAGE_WIDTH = MENU_WIDTH + MENU_ORIGIN
const STAGE_HEIGHT = MENU_HEIGHT + MENU_ORIGIN
const STAGE_PADDING = 20
const BUTTON_HOVER_SCALE = 1.08
const BUTTON_PRESS_SCALE = 0.94
const BUTTON_OPEN_SCALE = 0.5
const MENU_OPEN_X = 100
const MENU_OPEN_Y = 0
const BUTTON_OPEN_X = MENU_OPEN_X + MENU_WIDTH / 2 - BUTTON_SIZE / 2
const BUTTON_OPEN_Y = MENU_OPEN_Y + MENU_HEIGHT / 2 - BUTTON_SIZE / 2

const BUTTON_OPEN_POSITION_TRANSITION = spring({
  stiffness: 499,
  damping: 22
})
const BUTTON_CLOSE_POSITION_TRANSITION = spring({
  stiffness: 90,
  damping: 20,
  velocity: 2400
})
const BUTTON_SCALE_TRANSITION = spring({
  stiffness: 155,
  damping: 24
})
const BUTTON_CONTENT_OPEN_TRANSITION = easing({
  duration: 0.01,
  ease: Easing.easeOut
})
const BUTTON_CONTENT_CLOSE_TRANSITION = easing({
  duration: 0.15,
  ease: Easing.easeIn
})
const MENU_OPEN_POSITION_TRANSITION = spring({
  stiffness: 144,
  damping: 14,
  velocity: 2400
})
const MENU_OPEN_SIZE_TRANSITION = easing({
  duration: 0.3,
  ease: Easing.bezier(0.8, 0.3, 0.5, 0.8)
})
const MENU_CLOSE_POSITION_TRANSITION = spring({
  stiffness: 130,
  damping: 18
})
const MENU_CLOSE_SIZE_TRANSITION = easing({
  duration: 0.25,
  ease: Easing.easeOut
})
const MENU_OPEN_RADIUS_TRANSITION = easing({
  duration: 0.7,
  ease: Easing.easeOut
})
const MENU_CLOSE_RADIUS_TRANSITION = easing({
  duration: 0.7,
  ease: Easing.easeOut
})
const CONTENT_TRANSITION = spring({
  stiffness: 137,
  damping: 20
})
const CONTENT_BLUR_TRANSITION = easing({
  duration: 0.3,
  ease: Easing.easeOut
})
const CONTENT_OPTICS_TRANSITION = easing({
  duration: 0.3,
  ease: Easing.easeIn
})
const CONTENT_IOR = 1
const CONTENT_DEPTH = 0
const CONTENT_ACTIVE_IOR = 1.5
const CONTENT_ACTIVE_DEPTH = 80
const SLOW_MO_TIME_SCALE = 0.15

type MenuItem = {
  id: string
  Icon: LucideIcon
  label: string
}

type MenuProps = {
  items: {
    id: string
    type: 'hstack' | 'vstack' | 'divider'
    items: MenuItem[]
  }[]
}

export default function LiquidMenu({ items = [] }: MenuProps) {
  const [open, setOpen] = useState(false)
  const [contentOpticsActive, setContentOpticsActive] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)
  const [buttonPressed, setButtonPressed] = useState(false)
  const [slowMo, setSlowMo] = useState(false)
  const ignoreOutsidePressRef = useRef(false)
  const contentOpticsResetRef = useRef<number | null>(null)
  const buttonScale = open
    ? BUTTON_OPEN_SCALE
    : buttonPressed
      ? BUTTON_PRESS_SCALE
      : buttonHovered
        ? BUTTON_HOVER_SCALE
        : 1

  const menuContainerRef = useRef<FrameT | null>(null)
  const openRef = useRef<boolean>(open)

  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    setButtonHovered(false)
    setButtonPressed(false)
  }, [open])

  useEffect(
    () => () => {
      if (contentOpticsResetRef.current !== null) {
        window.cancelAnimationFrame(contentOpticsResetRef.current)
      }
    },
    []
  )

  function startContentOpticsTransition() {
    if (contentOpticsResetRef.current !== null) {
      window.cancelAnimationFrame(contentOpticsResetRef.current)
    }

    setContentOpticsActive(true)
    contentOpticsResetRef.current = window.requestAnimationFrame(() => {
      contentOpticsResetRef.current = null
      setContentOpticsActive(false)
    })
  }

  function setMenuOpen(nextOpen: boolean) {
    if (nextOpen === open) {
      return
    }

    if (nextOpen) {
      startContentOpticsTransition()
    }
    setOpen(nextOpen)
  }

  return (
    <>
      <LiquidCanvas className={styles.canvasShell} canvasClassName={styles.canvas}>
        <AnimationConfigProvider timeScale={slowMo ? SLOW_MO_TIME_SCALE : 1.5}>
          <ZStack alignment="center">
            <Html zIndex={-1} sizing="fill">
              <div className={styles.backgroundImage} />
              <button
                aria-pressed={slowMo}
                className={`${styles.slowMoToggle} ${slowMo ? styles.slowMoToggleActive : ''}`}
                type="button"
                onClick={() => setSlowMo((enabled) => !enabled)}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <span className={styles.slowMoCheckbox} aria-hidden="true" />
                Slow mo
              </button>
            </Html>
            <Frame alignment="center">
              <Padding insets={STAGE_PADDING}>
                <Frame width={STAGE_WIDTH} height={STAGE_HEIGHT} alignment="topLeading">
                  <GlassContainer
                    spacing={37}
                    bezelWidth={70}
                    thickness={40}
                    blur={20}
                    tint={{ r: 1, g: 1, b: 1, a: 0.5 }}
                    shadowColor={{ r: 0, g: 0, b: 0, a: 0.14 }}
                    shadowOffsetY={18}
                    shadowBlur={46}
                    specularOpacity={0.7}
                    displacementBlur={20}
                    contentIor={contentOpticsActive ? CONTENT_ACTIVE_IOR : CONTENT_IOR}
                    contentDepth={contentOpticsActive ? CONTENT_ACTIVE_DEPTH : CONTENT_DEPTH}
                    transition={{
                      contentIor: contentOpticsActive ? false : CONTENT_OPTICS_TRANSITION,
                      contentDepth: contentOpticsActive ? false : CONTENT_OPTICS_TRANSITION
                    }}
                  >
                    <ZStack alignment="topLeading">
                      <Transform
                        x={open ? MENU_OPEN_X : MENU_ORIGIN - MENU_WIDTH / 2}
                        y={open ? MENU_OPEN_Y : MENU_ORIGIN - MENU_HEIGHT / 2}
                        transition={{
                          x: open ? MENU_OPEN_POSITION_TRANSITION : MENU_CLOSE_POSITION_TRANSITION,
                          y: open ? MENU_OPEN_POSITION_TRANSITION : MENU_CLOSE_POSITION_TRANSITION
                        }}
                      >
                        <Frame width={MENU_WIDTH} height={MENU_HEIGHT} ref={menuContainerRef}>
                          <Glass
                            cornerRadius={open ? OPEN_MENU_RADIUS : CLOSED_MENU_RADIUS}
                            pointerEvents={false}
                            transition={{
                              cornerRadius: open
                                ? MENU_OPEN_RADIUS_TRANSITION
                                : MENU_CLOSE_RADIUS_TRANSITION
                            }}
                            cornerSmoothing={0.6}
                          >
                            <Frame
                              width={open ? MENU_WIDTH : CLOSED_MENU_SIZE}
                              height={open ? MENU_HEIGHT : CLOSED_MENU_SIZE}
                              transition={{
                                width: open
                                  ? MENU_OPEN_SIZE_TRANSITION
                                  : MENU_CLOSE_SIZE_TRANSITION,
                                height: open
                                  ? MENU_OPEN_SIZE_TRANSITION
                                  : MENU_CLOSE_SIZE_TRANSITION
                              }}
                            >
                              <Transform
                                scaleX={open ? 1 : CLOSED_MENU_CONTENT_SCALE}
                                scaleY={open ? 1 : CLOSED_MENU_CONTENT_SCALE}
                                origin={{ x: 0.5, y: 0.5 }}
                                transition={{
                                  scaleX: CONTENT_BLUR_TRANSITION,
                                  scaleY: CONTENT_BLUR_TRANSITION
                                }}
                              >
                                <Frame width={MENU_WIDTH} height={MENU_HEIGHT}>
                                  <Html
                                    blur={open ? OPEN_MENU_CONTENT_BLUR : CLOSED_MENU_CONTENT_BLUR}
                                    opacity={open ? 1 : 0}
                                    sizing="fill"
                                    transition={{
                                      blur: CONTENT_BLUR_TRANSITION,
                                      opacity: CONTENT_TRANSITION
                                    }}
                                  >
                                    <MenuContent
                                      items={items}
                                      open={open}
                                      onClose={() => {
                                        setMenuOpen(false)
                                      }}
                                    />
                                  </Html>
                                </Frame>
                              </Transform>
                            </Frame>
                          </Glass>
                          ={' '}
                        </Frame>
                      </Transform>
                      <Transform
                        x={open ? BUTTON_OPEN_X : 0}
                        y={open ? BUTTON_OPEN_Y : 0}
                        scaleX={buttonScale}
                        scaleY={buttonScale}
                        origin={{ x: 0.5, y: 0.5 }}
                        transition={{
                          x: open
                            ? BUTTON_OPEN_POSITION_TRANSITION
                            : BUTTON_CLOSE_POSITION_TRANSITION,
                          y: open
                            ? BUTTON_OPEN_POSITION_TRANSITION
                            : BUTTON_CLOSE_POSITION_TRANSITION,
                          scaleX: BUTTON_SCALE_TRANSITION,
                          scaleY: BUTTON_SCALE_TRANSITION
                        }}
                      >
                        <Frame width={BUTTON_SIZE} height={BUTTON_SIZE}>
                          <Glass
                            cornerRadius={BUTTON_SIZE / 2}
                            pointerEvents={!open}
                            onHover={setButtonHovered}
                            onPress={setButtonPressed}
                            onPointerDown={() => {
                              ignoreOutsidePressRef.current = true
                              setMenuOpen(true)
                            }}
                          >
                            <Html
                              opacity={open ? 0 : 1}
                              sizing="fill"
                              transition={{
                                opacity: open
                                  ? BUTTON_CONTENT_OPEN_TRANSITION
                                  : BUTTON_CONTENT_CLOSE_TRANSITION
                              }}
                            >
                              <ButtonDots />
                            </Html>
                          </Glass>
                        </Frame>
                      </Transform>
                    </ZStack>
                  </GlassContainer>
                </Frame>
              </Padding>
            </Frame>
          </ZStack>
        </AnimationConfigProvider>
      </LiquidCanvas>
    </>
  )
}

function ButtonDots() {
  return (
    <div className={styles.buttonContent} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
}

type MenuContentProps = {
  items: MenuProps['items']
  open: boolean
  onClose: () => void
}

function MenuContent({ items = [], open, onClose }: MenuContentProps) {
  const menuContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onPointerDown(event: globalThis.PointerEvent) {
      if (!open) return

      const el = menuContainerRef.current
      if (!el) return

      if (el.contains(event.target as Node)) return

      onClose?.()
    }
    window.addEventListener('pointerdown', onPointerDown, {
      capture: true
    })

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, onClose])

  return (
    <div className={styles.menuClip} ref={menuContainerRef}>
      <nav className={styles.menuContent} aria-label="Browser menu">
        {items.map((section) => {
          const type = section.type
          if (type === 'divider') {
            return <div className={styles.divider} key={section.id} />
          } else if (type === 'hstack') {
            return (
              <div className={styles.footerGrid} key={section.id}>
                {section.items.map((item) => (
                  <div key={item.label} className={styles.footerItem}>
                    <item.Icon className={styles.footerIcon} strokeWidth={1.8} aria-hidden="true" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )
          }
          return (
            <>
              {section.items.map((item) => (
                <MenuRow key={item.label} item={item} />
              ))}
            </>
          )
        })}
      </nav>
    </div>
  )
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <div className={styles.menuRow}>
      <item.Icon className={styles.menuIcon} strokeWidth={1.8} aria-hidden="true" />
      <span>{item.label}</span>
    </div>
  )
}
