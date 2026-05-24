import { Button } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import {
  Copy,
  BookOpen,
  Bookmark,
  Upload,
  Hand,
  Plus,
  Album,
  Clock3,
  Grid2X2,
  Grid3X3,
  House,
  MicVocal,
  Music,
  Radio,
  Search,
  SquareUserRound,
  Star,
  type LucideIcon,
} from "lucide-react";

import Icon from "~/components/Icon";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";
import { SIDENAV_STORAGE_KEY } from "~/constants";

import styles from "./index.module.css";
import Menu from "~/components/Menu";
import Sidebar from "~/components/Sidebar";
import { Html } from "@liquid-dom/react";

export const Route = createFileRoute("/")({ component: App });

function getInitialNavState(): boolean {
  const stored = localStorage.getItem(SIDENAV_STORAGE_KEY) as "0" | "1" | null;
  if (stored && ["0", "1"].includes(stored)) return stored === "1";

  return true;
}

function App() {
  const [open, setOpen] = useState(getInitialNavState);

  const handleSideNavToggle = useCallback(() => {
    setOpen((v) => {
      const ns = !v;
      localStorage.setItem(SIDENAV_STORAGE_KEY, ns ? "1" : "0");
      return ns;
    });
  }, []);

  const renderNavToggler = useCallback(
    (iconSize?: number) => (
      <Button
        size="sm"
        isIconOnly
        variant="ghost"
        className="h-8"
        onClick={handleSideNavToggle}
      >
        <Icon name="sideNav" size={iconSize ?? 25} />
      </Button>
    ),
    [handleSideNavToggle],
  );

  return (
    <div className="h-screen w-screen">
      {!open ? (
        <div className="fixed top-1 left-25 z-1">{renderNavToggler(20)}</div>
      ) : null}
      {/*<div className={styles.container}>
        <motion.div
          className={styles.sidebar}
          initial={false}
          animate={{
            width: open ? 300 : 0,
            opacity: open ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 28,
          }}
        >
          <AnimatePresence>
            {open ? (
              <motion.div
                key="sidebar-content"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 pt-8"
              >
                <div className="absolute right-2 bottom-2 z-1">
                  <ThemeSwitcher />
                </div>
              </motion.div>
            ) : null}
            <div className="absolute top-5 right-2">{renderNavToggler()}</div>
          </AnimatePresence>
        </motion.div>
        <div className="bg-snow dark:bg-eclipse relative flex items-center justify-center">
          <Sidebar
            items={[
              {
                id: "1",
                type: "sidebarItem",
                items: [
                  { Icon: Search, label: "Search", id: "Search" },
                  { Icon: House, label: "Home", id: "Home" },
                  { Icon: Grid2X2, label: "New", id: "New" },
                  { Icon: Radio, label: "Radio", id: "Radio" },
                ],
              },
            ]}
            renderMainContent={() => (
              <Menu
                items={[
                  {
                    id: "1",
                    type: "vstack",
                    items: [
                      { Icon: Upload, label: "Share", id: "Share" },
                      {
                        Icon: Bookmark,
                        label: "Add to Bookmarks",
                        id: "Add to Bookmarks",
                      },
                      {
                        Icon: BookOpen,
                        label: "Add Bookmark to...",
                        id: "Add Bookmark to...",
                      },
                    ],
                  },
                  { id: "2", type: "divider", items: [] },
                  {
                    id: "3",
                    type: "vstack",
                    items: [
                      { Icon: Plus, label: "New Tab", id: "New Tab" },
                      { Icon: Hand, label: "Private Tab", id: "Private Tab" },
                    ],
                  },
                  { id: "4", type: "divider", items: [] },
                  {
                    id: "5",
                    type: "hstack",
                    items: [
                      { Icon: BookOpen, label: "Bookmarks", id: "Bookmarks" },
                      { Icon: Copy, label: "All Tabs", id: "All Tabs" },
                    ],
                  },
                ]}
              />
            )}
          />
        </div>
      </div>*/}
      <Sidebar
        items={[
          {
            id: "1",
            type: "sidebarItem",
            items: [
              { Icon: Search, label: "Search", id: "Search" },
              { Icon: House, label: "Home", id: "Home" },
              { Icon: Grid2X2, label: "New", id: "New" },
              { Icon: Radio, label: "Radio", id: "Radio" },
            ],
          },
        ]}
        renderMainContent={() => (
          <Menu
            items={[
              {
                id: "1",
                type: "vstack",
                items: [
                  { Icon: Upload, label: "Share", id: "Share" },
                  {
                    Icon: Bookmark,
                    label: "Add to Bookmarks",
                    id: "Add to Bookmarks",
                  },
                  {
                    Icon: BookOpen,
                    label: "Add Bookmark to...",
                    id: "Add Bookmark to...",
                  },
                ],
              },
              { id: "2", type: "divider", items: [] },
              {
                id: "3",
                type: "vstack",
                items: [
                  { Icon: Plus, label: "New Tab", id: "New Tab" },
                  { Icon: Hand, label: "Private Tab", id: "Private Tab" },
                ],
              },
              { id: "4", type: "divider", items: [] },
              {
                id: "5",
                type: "hstack",
                items: [
                  { Icon: BookOpen, label: "Bookmarks", id: "Bookmarks" },
                  { Icon: Copy, label: "All Tabs", id: "All Tabs" },
                ],
              },
            ]}
          />
        )}
        // renderMainContent={() => (
        //   <Html sizing="fill" zIndex={-1}>
        //     <div className="w-full max-h-[80vh] overflow-y-scroll">
        //       <h1 className="w-full bg-red-200 text-[200px]!  text-red-900">
        //         HELLO WORLD
        //       </h1>
        //       <h1 className="w-full bg-red-200 text-[200px]!  text-red-900">
        //         HELLO WORLD
        //       </h1>
        //       <h1 className="w-full bg-red-200 text-[200px]!  text-red-900">
        //         HELLO WORLD
        //       </h1>
        //       <h1 className="w-full bg-red-200 text-[200px]!  text-red-900">
        //         HELLO WORLD
        //       </h1>
        //       <h1 className="w-full bg-red-200 text-[200px]!  text-red-900">
        //         HELLO WORLD
        //       </h1>
        //       <h1 className="w-full bg-red-200 text-[200px]!  text-red-900">
        //         HELLO WORLD
        //       </h1>
        //       <h1 className="w-full bg-red-200 text-[200px]!  text-red-900">
        //         HELLO WORLD
        //       </h1>
        //     </div>
        //   </Html>
        // )}
      />
    </div>
  );
}

export default App;
