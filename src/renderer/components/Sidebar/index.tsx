import { ReactNode, useState } from "react";
import {
  Frame,
  Glass,
  GlassContainer,
  Html,
  LiquidCanvas,
  Transform,
  ZStack,
} from "@liquid-dom/react";
import { type LucideIcon } from "lucide-react";
import styles from "./index.module.css";
import { useWindowSize } from "~/hooks/useWindowResize";

const SIDEBAR_WIDTH = 260;

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
};

export default function Sidebar({ items, renderMainContent }: SidebarProps) {
  const { height } = useWindowSize();
  return (
    <section className={styles.root}>
      <LiquidCanvas
        className={styles.canvasShell}
        canvasClassName={styles.canvas}
      >
        <Frame maxWidth={Infinity} maxHeight={Infinity} alignment={"leading"}>
          <GlassContainer
            blur={200}
            bezelWidth={170}
            displacementBlur={25}
            thickness={0}
            shadowColor={{ r: 0, g: 0, b: 0, a: 0.28 }}
            shadowBlur={30}
            specularOpacity={0.9}
            surfaceProfile="concave"
            specularFalloff={2}
            tint={{ r: 0.15, g: 0.15, b: 0.15, a: 0.8 }}
          >
            <Transform>
              <Glass cornerRadius={40}>
                <Frame width={SIDEBAR_WIDTH} height={height}>
                  <Html sizing="fill">
                    <SidebarLeft items={items} />
                  </Html>
                </Frame>
              </Glass>
            </Transform>
          </GlassContainer>
        </Frame>
      </LiquidCanvas>
      {renderMainContent?.()}
    </section>
  );
}

type SidebarLeftProps = {
  items: SidebarProps["items"];
};
function SidebarLeft({ items }: SidebarLeftProps) {
  const [selectedItem, setSelectedItem] = useState("Home");

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
            selectedItem={selectedItem}
            onSelect={setSelectedItem}
          />
        );
      })}
    </nav>
  );
}

function SidebarGroup({
  title,
  items,
  selectedItem,
  onSelect,
}: {
  title?: string;
  items: SidebarItem[];
  selectedItem: string;
  onSelect: (label: string) => void;
}) {
  return (
    <div className={styles.sidebarGroup}>
      {title ? <div className={styles.groupTitle}>{title}</div> : null}
      {items.map((item) => (
        <button
          key={item.label}
          className={[
            styles.sidebarItem,
            item.label === selectedItem ? styles.sidebarItemActive : "",
          ].join(" ")}
          type="button"
          aria-current={item.label === selectedItem ? "page" : undefined}
          onClick={() => onSelect(item.label)}
        >
          <item.Icon className={styles.icon} aria-hidden="true" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
