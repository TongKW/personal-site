"use client";
import {
  Root as NavRoot,
  List as NavList,
  Item as NavItem,
  Link as NavLink,
  Viewport as NavViewport,
  Indicator as NavIndicator,
} from "@radix-ui/react-navigation-menu";
import clsx from "clsx";
import { usePathname } from "next/navigation";
interface Item {
  href: string;
  text: string;
}

export function NavigationMenu(props: {
  items: Item[];
  orientation?: "vertical" | "horizontal";
  gap?: number;
  fontSize?: string;
}) {
  const { items, orientation = "horizontal", gap = 4, fontSize = "lg" } = props;

  const NAV_ITEM_TEXT_ACTIVE = `text-brand-1 text-${fontSize} font-medium leading-normal`;
  const NAV_ITEM_TEXT = `text-accent-2 text-${fontSize} font-medium leading-normal`;

  const pathname = usePathname();

  return (
    <NavRoot>
      <NavList
        className={clsx(`flex gap-${gap} py-4 px-6`, {
          "flex-col": orientation === "vertical",
        })}
      >
        {items.map((item, index) => (
          <MenuItem key={`navigation-menu-item-${index}`} item={item} />
        ))}
        <NavIndicator />
      </NavList>

      <NavViewport />
    </NavRoot>
  );

  function MenuItem(props: { item: Item }) {
    const { item } = props;
    const isActive = pathname === item.href;

    return (
      <NavItem>
        <NavLink href={item.href}>
          <p className={clsx(isActive ? NAV_ITEM_TEXT_ACTIVE : NAV_ITEM_TEXT)}>
            {item.text}
          </p>
        </NavLink>
      </NavItem>
    );
  }
}
