import { Html } from '@liquid-dom/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  BellIcon,
  BellRingIcon,
  Bookmark,
  BookOpen,
  Copy,
  Ellipsis,
  GridIcon,
  Hand,
  Plus,
  SidebarIcon,
  SlidersHorizontalIcon,
  Upload,
  VideoIcon
} from 'lucide-react'
import { useMemo } from 'react'

import ControlCenter from '~/components/ControlCenter'
import LiquidMenu from '~/components/LiquidMenu'
import Notification from '~/components/Notification'
import NotificationCenter from '~/components/NotificationCenter'
import R3F from '~/components/R3F'
import Sidebar from '~/components/Sidebar'
import VideoPlayer from '~/components/VideoPlayer'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const navigate = useNavigate()
  const { tab = 'liquid-menu' } = Route.useSearch() as { tab: string }

  return (
    <div className="h-screen w-screen">
      <Sidebar
        layoutMode={['reflective-sidebar'].includes(tab) ? 'overlay' : 'column'}
        activeItemId={tab}
        onItemSelect={(id) => {
          navigate({
            to: '.',
            search: (prev) => ({ ...prev, tab: id })
          })
        }}
        items={[
          {
            id: '1',
            type: 'sidebarItem',
            items: [
              { Icon: Ellipsis, label: 'Liquid Menu', id: 'liquid-menu' },
              {
                Icon: SidebarIcon,
                label: 'Reflective Sidebar',
                id: 'reflective-sidebar'
              },
              {
                Icon: VideoIcon,
                label: 'Video Player',
                id: 'video-player'
              },
              {
                Icon: BellRingIcon,
                label: 'Notification',
                id: 'notification'
              },
              {
                Icon: SlidersHorizontalIcon,
                label: 'R3F',
                id: 'r3f'
              },
              {
                Icon: GridIcon,
                label: 'Control Center',
                id: 'control-center'
              },
              {
                Icon: BellIcon,
                label: 'Notification Center',
                id: 'notification-center'
              }
            ]
          }
        ]}
        renderMainContent={() => {
          if (tab === 'liquid-menu') {
            return (
              <LiquidMenu
                items={[
                  {
                    id: '1',
                    type: 'vstack',
                    items: [
                      { Icon: Upload, label: 'Share', id: 'Share' },
                      {
                        Icon: Bookmark,
                        label: 'Add to Bookmarks',
                        id: 'Add to Bookmarks'
                      },
                      {
                        Icon: BookOpen,
                        label: 'Add Bookmark to...',
                        id: 'Add Bookmark to...'
                      }
                    ]
                  },
                  { id: '2', type: 'divider', items: [] },
                  {
                    id: '3',
                    type: 'vstack',
                    items: [
                      { Icon: Plus, label: 'New Tab', id: 'New Tab' },
                      { Icon: Hand, label: 'Private Tab', id: 'Private Tab' }
                    ]
                  },
                  { id: '4', type: 'divider', items: [] },
                  {
                    id: '5',
                    type: 'hstack',
                    items: [
                      { Icon: BookOpen, label: 'Bookmarks', id: 'Bookmarks' },
                      { Icon: Copy, label: 'All Tabs', id: 'All Tabs' }
                    ]
                  }
                ]}
              />
            )
          } else if (tab === 'reflective-sidebar') {
            return (
              <Html zIndex={-2} sizing="fill">
                <Grid500 />
              </Html>
            )
          } else if (tab === 'video-player') {
            return <VideoPlayer />
          } else if (tab === 'notification') {
            return <Notification />
          } else if (tab === 'r3f') {
            return <R3F />
          } else if (tab === 'control-center') {
            return <ControlCenter />
          } else if (tab === 'notification-center') {
            return <NotificationCenter />
          }
          return null
        }}
      />
    </div>
  )
}

const colors = [
  'bg-red-600',
  'bg-blue-600',
  'bg-green-600',
  'bg-yellow-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-indigo-600',
  'bg-emerald-600'
]

function Grid500() {
  const boxes = Array.from({ length: 500 })

  const columnColors = useMemo(() => {
    const cols = 50
    return Array.from({ length: cols }, () => {
      return colors[Math.floor(Math.random() * colors.length)]
    })
  }, [])

  return (
    <div className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-1 overflow-y-auto">
      {boxes.map((_, i) => {
        const colIndex = i % columnColors.length
        const color = columnColors[colIndex]

        return <div key={i} className={`aspect-square w-full ${color}`} />
      })}
    </div>
  )
}

export default App
