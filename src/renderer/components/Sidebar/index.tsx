import { ReactNode } from "react";
import {
  Frame,
  Glass,
  GlassContainer,
  Html,
  LiquidCanvas,
  ZStack,
} from "@liquid-dom/react";
import { type LucideIcon } from "lucide-react";
import styles from "./index.module.css";
import { useWindowSize } from "~/hooks/useWindowResize";

type SidebarItem = {
  id: string;
  Icon: LucideIcon;
  label: string;
};

type SidebarProps = {
  renderMainContent?: () => ReactNode;
  items: {
    id: string;
    type: "sidebarItem" | "divider";
    items: SidebarItem[];
    sectionTitle?: string | null;
  }[];
  activeItemId?: string;
  onItemSelect?: (id: string) => void;
  /**
   * Nested canvas element only works in column mode
   */
  layoutMode?: "overlay" | "column";
};

export default function Sidebar({
  items,
  renderMainContent,
  activeItemId,
  onItemSelect,
  layoutMode = "column",
}: SidebarProps) {
  const { height } = useWindowSize();
  return (
    <section
      className={`${styles.root} ${layoutMode === "overlay" ? styles.overlay : ""}`}
    >
      <LiquidCanvas
        className={styles.canvasShell}
        canvasClassName={styles.canvas}
      >
        <ZStack alignment={"trailing"}>
          {layoutMode === "overlay" ? renderMainContent?.() : null}
          <Frame
            maxWidth={Infinity}
            maxHeight={Infinity}
            height={height}
            alignment={"leading"}
          >
            <GlassContainer
              blur={200}
              bezelWidth={170}
              displacementBlur={25}
              thickness={0}
              dispersion={10}
              shadowColor={{ r: 0, g: 0, b: 0, a: 0.28 }}
              shadowBlur={30}
              specularOpacity={1}
              surfaceProfile="concave"
              specularFalloff={2}
              specularWidth={1}
              tint={{ r: 0.15, g: 0.15, b: 0.15, a: 0.9 }}
            >
              <Glass cornerRadius={40}>
                <Frame width={260}>
                  <Html sizing="fill">
                    <SidebarLeft
                      items={items}
                      activeItemId={activeItemId}
                      onItemSelect={onItemSelect}
                    />
                  </Html>
                </Frame>
              </Glass>
            </GlassContainer>
          </Frame>
        </ZStack>
      </LiquidCanvas>
      {layoutMode === "column" ? renderMainContent?.() : null}
    </section>
  );
}

type SidebarLeftProps = {
  items: SidebarProps["items"];
  activeItemId?: string;
  onItemSelect?: (id: string) => void;
};
function SidebarLeft({ items, activeItemId, onItemSelect }: SidebarLeftProps) {
  return (
    <nav className={styles.sidebarContent} aria-label="Sidebar navigation">
      {items.map((li) => {
        if (li.type === "divider") {
          return <div className={styles.divider} key={li.id} />;
        }
        return (
          <SidebarGroup
            key={li.id}
            title={li.sectionTitle ?? undefined}
            items={li.items}
            activeItemId={activeItemId}
            onItemSelect={onItemSelect}
          />
        );
      })}
    </nav>
  );
}

function SidebarGroup({
  title,
  items,
  activeItemId,
  onItemSelect,
}: {
  title?: string;
  items: SidebarItem[];
  activeItemId?: string;
  onItemSelect?: (id: string) => void;
}) {
  return (
    <div className={styles.sidebarGroup}>
      {title ? <div className={styles.groupTitle}>{title}</div> : null}
      {items.map((item) => (
        <button
          key={item.id}
          className={[
            styles.sidebarItem,
            item.id === activeItemId ? styles.sidebarItemActive : "",
          ].join(" ")}
          type="button"
          aria-current={item.id === activeItemId ? "page" : undefined}
          onClick={() => onItemSelect?.(item.id)}
        >
          <item.Icon className={styles.icon} aria-hidden="true" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
