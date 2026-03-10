import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  Plus,
  Minus,
  MoreVertical,
  type LucideIcon,
} from "lucide-react"

export interface SidebarItem {
  id: string
  label: string
  icon?: LucideIcon | string
  href?: string
  badge?: string | number
  badgeVariant?: "default" | "notification" | "coming-soon"
  children?: SidebarItem[]
  isActive?: boolean
}

export interface SidebarSection {
  id: string
  label: string
  items: SidebarItem[]
  defaultExpanded?: boolean
}

export interface SidebarUser {
  name: string
  role: string
  avatar?: string
}

interface SidebarProps {
  logo?: ReactNode
  collapsedLogo?: ReactNode
  sections: SidebarSection[]
  user?: SidebarUser
  onItemClick?: (item: SidebarItem) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

interface SidebarNavItemProps {
  item: SidebarItem
  depth?: number
  onItemClick?: (item: SidebarItem) => void
  isExpanded?: boolean
  onToggleExpand?: (itemId: string) => void
  isCollapsed?: boolean
}

interface TreeChildItemProps {
  item: SidebarItem
  isLast: boolean
  isActiveAbove: boolean
  onItemClick?: (item: SidebarItem) => void
}

function TreeChildItem({ item, isLast, isActiveAbove, onItemClick }: TreeChildItemProps) {
  const isActive = item.isActive ?? false
  
  return (
    <div className="relative flex items-stretch">
      {/* Connector lines container */}
      <div className="relative w-8 shrink-0 ml-3">
        {/* Vertical line - from top to horizontal connector */}
        <div
          className={cn(
            "absolute left-0 top-0 w-0.5 h-1/2",
            isActive || isActiveAbove ? "bg-brand-primary" : "bg-gray-200"
          )}
        />
        {/* Vertical line - from horizontal connector to bottom (only if not last) */}
        {!isLast && (
          <div
            className={cn(
              "absolute left-0 top-1/2 w-0.5 h-1/2",
              "bg-gray-200"
            )}
          />
        )}
        {/* Horizontal connector line */}
        <div
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-4",
            isActive ? "bg-brand-primary" : "bg-gray-200"
          )}
        />
      </div>
      
      {/* Child item button */}
      <button
        onClick={() => onItemClick?.(item)}
        title={item.label}
        className={cn(
          "flex flex-1 items-center gap-3 rounded-lg px-3 py-2 transition-colors min-w-0",
          "hover:bg-sidebar-hover",
          "font-medium text-sidebar-item",
          isActive && "bg-sidebar-active font-semibold text-sidebar-item-active"
        )}
        style={{ fontSize: '13px' }}
      >
        <span className="flex-1 text-left truncate min-w-0">{item.label}</span>
        {item.badge !== undefined && (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-xs font-medium",
              item.badgeVariant === "notification"
                ? "bg-status-danger text-white"
                : item.badgeVariant === "coming-soon"
                  ? "bg-gray-200 text-gray-500"
                  : "bg-sidebar-item-active text-white"
            )}
          >
            {item.badge}
          </span>
        )}
      </button>
    </div>
  )
}

function SidebarNavItem({ item, onItemClick, isExpanded = false, onToggleExpand, isCollapsed = false }: SidebarNavItemProps) {
  const hasChildren = item.children && item.children.length > 0
  const icon = item.icon
  const isImageIcon = typeof icon === "string"
  const LucideIcon = !isImageIcon ? icon : undefined

  const handleClick = () => {
    if (isCollapsed) {
      onItemClick?.(item)
      return
    }
    if (hasChildren) {
      onToggleExpand?.(item.id)
    } else {
      onItemClick?.(item)
    }
  }

  const activeChildIndex = item.children?.findIndex((child) => child.isActive) ?? -1
  const hasActiveChild = activeChildIndex !== -1

  if (isCollapsed) {
    return (
      <button
        onClick={handleClick}
        title={item.label}
        className={cn(
          "flex w-full items-center justify-center rounded-lg p-2 transition-colors",
          "hover:bg-sidebar-hover",
          (item.isActive || hasActiveChild) && "bg-sidebar-active"
        )}
      >
        {icon && (
          isImageIcon ? (
            <img
              src={icon}
              alt=""
              className="h-[18px] w-[18px]"
            />
          ) : LucideIcon ? (
            <LucideIcon
              className={cn(
                "h-[18px] w-[18px]",
                (item.isActive || hasActiveChild) ? "text-sidebar-item-active" : "text-sidebar-item"
              )}
            />
          ) : null
        )}
      </button>
    )
  }

  return (
    <div>
      {/* Parent item */}
      <button
        onClick={handleClick}
        title={item.label}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors overflow-hidden",
          "hover:bg-sidebar-hover",
          "font-medium text-sidebar-item",
          item.isActive && !hasChildren && "bg-sidebar-active font-semibold text-sidebar-item-active"
        )}
        style={{ fontSize: '13px' }}
      >
        {icon && (
          isImageIcon ? (
            <img
              src={icon}
              alt=""
              className="h-[18px] w-[18px] shrink-0"
            />
          ) : LucideIcon ? (
            <LucideIcon
              className={cn(
                "h-[18px] w-[18px] shrink-0",
                item.isActive ? "text-sidebar-item-active" : "text-sidebar-item"
              )}
            />
          ) : null
        )}
        <span className="flex-1 text-left truncate min-w-0">{item.label}</span>
        {item.badge !== undefined && !hasChildren && (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-xs font-medium",
              item.badgeVariant === "notification"
                ? "bg-status-danger text-white"
                : item.badgeVariant === "coming-soon"
                  ? "bg-gray-200 text-gray-500"
                  : "bg-sidebar-item-active text-white"
            )}
          >
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <span className="text-sidebar-item">
            {isExpanded ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </span>
        )}
      </button>
      
      {/* Tree-style children with smooth transition */}
      {hasChildren && (
        <div
          className={cn(
            "grid transition-all duration-200 ease-in-out",
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="mt-1">
              {item.children?.map((child, index) => (
                <TreeChildItem
                  key={child.id}
                  item={child}
                  isLast={index === (item.children?.length ?? 0) - 1}
                  isActiveAbove={activeChildIndex !== -1 && index <= activeChildIndex}
                  onItemClick={onItemClick}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DefaultLogo({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <img 
      src={isCollapsed ? "/images/maxone_logo_collapsed.svg" : "/images/Maxone_logo.svg"} 
      alt="MaxOne" 
      className="h-6" 
    />
  )
}

function CollapsedAccountMenu({ user }: { user: SidebarUser }) {
  const nameParts = user.name.split(" ")
  const initials = nameParts
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center justify-center">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="h-9 w-9 object-cover"
          style={{ borderRadius: '5px' }}
          title={user.name}
        />
      ) : (
        <div 
          className="flex h-9 w-9 items-center justify-center bg-brand-primary text-sm font-semibold text-brand-dark"
          style={{ borderRadius: '5px' }}
          title={user.name}
        >
          {initials}
        </div>
      )}
    </div>
  )
}

function AccountMenu({ user }: { user: SidebarUser }) {
  const nameParts = user.name.split(" ")
  const initials = nameParts
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  
  const displayName = nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
    : nameParts[0]

  return (
    <div className="flex items-center gap-3 rounded-lg bg-white px-3 py-3" style={{ borderRadius: '8px' }}>
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="h-9 w-9 object-cover"
          style={{ borderRadius: '5px' }}
        />
      ) : (
        <div 
          className="flex h-9 w-9 items-center justify-center bg-brand-primary text-sm font-semibold text-brand-dark"
          style={{ borderRadius: '5px' }}
        >
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="truncate font-semibold text-sidebar-item-active" style={{ fontSize: '13.5px' }}>{displayName}</p>
        <p className="truncate text-xs font-medium text-sidebar-user-role">{user.role}</p>
      </div>
      <button className="shrink-0 rounded p-1 hover:bg-muted">
        <MoreVertical className="h-4 w-4 text-sidebar-item" />
      </button>
    </div>
  )
}

interface NavSectionProps {
  section: SidebarSection
  isCollapsed: boolean
  isSectionExpanded: boolean
  onToggleSectionExpand: (sectionId: string) => void
  expandedItemId: string | null
  onToggleItemExpand: (itemId: string) => void
  onItemClick?: (item: SidebarItem) => void
}

function NavSection({ 
  section, 
  isCollapsed, 
  isSectionExpanded, 
  onToggleSectionExpand, 
  expandedItemId, 
  onToggleItemExpand, 
  onItemClick 
}: NavSectionProps) {
  if (isCollapsed) {
    return (
      <div className="space-y-1 mb-4">
        {section.items.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            onItemClick={onItemClick}
            isExpanded={expandedItemId === item.id}
            onToggleExpand={onToggleItemExpand}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mb-2">
      {/* Section label - clickable to expand/collapse */}
      <button
        onClick={() => onToggleSectionExpand(section.id)}
        className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-sidebar-hover rounded transition-colors"
      >
        <span 
          className="font-medium text-sidebar-label uppercase"
          style={{ fontSize: '11px', letterSpacing: '1px' }}
        >
          {section.label}
        </span>
        <span className="text-sidebar-label">
          {isSectionExpanded ? (
            <Minus className="h-3 w-3" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </span>
      </button>

      {/* Section items with smooth transition */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isSectionExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 mt-1">
            {section.items.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                onItemClick={onItemClick}
                isExpanded={expandedItemId === item.id}
                onToggleExpand={onToggleItemExpand}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ logo, collapsedLogo, sections, user, onItemClick, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const getInitialExpandedItemId = () => {
    for (const section of sections) {
      for (const item of section.items) {
        if (item.children?.some((child) => child.isActive)) {
          return item.id
        }
      }
    }
    return null
  }

  const getInitialExpandedSections = () => {
    const expanded: string[] = []
    for (const section of sections) {
      if (section.defaultExpanded !== false) {
        expanded.push(section.id)
      }
      for (const item of section.items) {
        if (item.isActive || item.children?.some((child) => child.isActive)) {
          if (!expanded.includes(section.id)) {
            expanded.push(section.id)
          }
        }
      }
    }
    return expanded
  }

  const [expandedItemId, setExpandedItemId] = useState<string | null>(getInitialExpandedItemId)
  const [expandedSections, setExpandedSections] = useState<string[]>(getInitialExpandedSections)

  const handleToggleItemExpand = (itemId: string) => {
    setExpandedItemId((currentId) => (currentId === itemId ? null : itemId))
  }

  const handleToggleSectionExpand = (sectionId: string) => {
    setExpandedSections((current) => 
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId]
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo area with collapse toggle */}
      <div className={cn(
        "flex items-center py-4 shrink-0",
        isCollapsed ? "justify-center px-2" : "justify-between px-3"
      )}>
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="group relative flex items-center justify-center rounded p-1 hover:bg-sidebar-hover transition-colors"
            title="Expand sidebar"
          >
            {/* Logo - visible by default, hidden on hover */}
            <div className="transition-opacity duration-200 group-hover:opacity-0">
              {collapsedLogo ?? <DefaultLogo isCollapsed />}
            </div>
            {/* Expand icon - hidden by default, visible on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <img 
                src="/images/collapse.svg" 
                alt="Expand" 
                className="h-5 w-5 rotate-180"
              />
            </div>
          </button>
        ) : (
          <>
            {logo ?? <DefaultLogo />}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="rounded p-1 hover:bg-sidebar-hover transition-colors"
                title="Collapse sidebar"
              >
                <img 
                  src="/images/collapse.svg" 
                  alt="Collapse" 
                  className="h-5 w-5 transition-transform duration-300"
                />
              </button>
            )}
          </>
        )}
      </div>

      {/* Navigation - scrollable */}
      <nav className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden py-2 min-h-0",
        isCollapsed ? "px-2" : "px-3"
      )}>
        {sections.map((section) => (
          <NavSection
            key={section.id}
            section={section}
            isCollapsed={isCollapsed}
            isSectionExpanded={expandedSections.includes(section.id)}
            onToggleSectionExpand={handleToggleSectionExpand}
            expandedItemId={expandedItemId}
            onToggleItemExpand={handleToggleItemExpand}
            onItemClick={onItemClick}
          />
        ))}
      </nav>

      {/* Account menu */}
      {user && (
        <div className={cn(
          "mt-auto shrink-0",
          isCollapsed ? "px-2 pt-2 pb-4" : "px-3 py-4"
        )}>
          {isCollapsed ? (
            <CollapsedAccountMenu user={user} />
          ) : (
            <AccountMenu user={user} />
          )}
        </div>
      )}
    </div>
  )
}
