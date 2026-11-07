"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ArrowUpRight, BookOpen, Bot, ChevronDown, CircleHelp, CreditCard, KeyRound, LayoutDashboard, LogOut, Menu, MessageSquare, PanelLeftClose, PanelLeftOpen, Search, Settings, Shapes, ShieldCheck, Users, Wallet } from "lucide-react";
import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { BrandWordmark } from "@/components/system/Brand";
import { initialConversations, initialKeys, initialProfile, initialTasks, type Conversation, type DemoKey, type DemoTask } from "./fixtures";
import { ActionLink, Badge, Button, Dialog } from "./ui";
import { WorkspaceSearch } from "./WorkspaceSearch";
import { useBusinessDemo } from "./BusinessDemo";

type Store = {
  profile: typeof initialProfile; setProfile: Dispatch<SetStateAction<typeof initialProfile>>;
  keys: DemoKey[]; setKeys: Dispatch<SetStateAction<DemoKey[]>>;
  plan: string; setPlan: Dispatch<SetStateAction<string>>;
  conversations: Conversation[]; setConversations: Dispatch<SetStateAction<Conversation[]>>;
  tasks: DemoTask[]; setTasks: Dispatch<SetStateAction<DemoTask[]>>;
  dashboardHref: string; setDashboardHref: Dispatch<SetStateAction<string>>;
  reset: () => void;
};

const WorkspaceContext = createContext<Store | null>(null);

export function useWorkspace() {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) throw new Error("Workspace state is available inside the application shell.");
  return workspace;
}

const navigation = [
  { group: "Workspace", links: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Playground", href: "/playground", icon: MessageSquare },
    { title: "Agent", href: "/agent", icon: Bot },
    { title: "Models", href: "/models", icon: Shapes },
  ] },
  { group: "Account", links: [
    { title: "API keys", href: "/dashboard/api-keys", icon: KeyRound },
    { title: "Spending", href: "/dashboard/spending", icon: Wallet },
    { title: "Usage & billing", href: "/dashboard/usage", icon: Activity },
    { title: "Plans", href: "/pricing", icon: CreditCard },
    { title: "Settings", href: "/settings", icon: Settings },
  ] },
  { group: "Resources", links: [{ title: "Documentation", href: "/docs", icon: BookOpen }] },
];

const ownerNavigation = [
  {group:"Owner console",links:[
    {title:"Overview",href:"/owner",icon:LayoutDashboard},
    {title:"Customers",href:"/owner/customers",icon:Users},
    {title:"Unit economics",href:"/owner/economics",icon:Activity},
    {title:"Model routes",href:"/owner/model-routes",icon:Shapes},
  ]},
  {group:"Preview",links:[{title:"Customer panel",href:"/dashboard/spending",icon:Wallet},{title:"Documentation",href:"/docs",icon:BookOpen}]},
];

function linkActive(href: string, pathname: string) {
  return href === pathname || (href === "/models" && pathname.startsWith("/models/")) || (href === "/owner/customers" && pathname.startsWith("/owner/customers/")) || (href === "/dashboard/spending" && pathname.startsWith("/preview/customer/"));
}

function Navigation({ pathname, onSelect }: { pathname: string; onSelect?: () => void }) {
  const { dashboardHref } = useWorkspace();
  const groups = pathname.startsWith("/owner") ? ownerNavigation : navigation;
  return <nav className="aw-nav" aria-label="Application">
    {groups.map(group => <div key={group.group}><p>{group.group}</p>{group.links.map(({ title, href, icon: Icon }) => {
      const active = linkActive(href, pathname);
      return <Link key={href} href={href === "/dashboard" ? dashboardHref : href} onClick={onSelect} aria-current={active ? "page" : undefined} title={title} aria-label={title}><Icon size={18} aria-hidden /><span>{title}</span></Link>;
    })}</div>)}
  </nav>;
}

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { customers, changePlan, resetCustomer } = useBusinessDemo();
  const owner = pathname.startsWith("/owner");
  const previewCustomer = pathname.startsWith("/preview/customer/") ? customers.find(customer => customer.id === pathname.split("/").at(-1)) : undefined;
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [logout, setLogout] = useState(false);
  const [search, setSearch] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [keys, setKeys] = useState(initialKeys);
  const plan = customers.find(customer => customer.id === "mira")!.plan;
  const [conversations, setConversations] = useState(initialConversations);
  const [tasks, setTasks] = useState(initialTasks);
  const [dashboardHref, setDashboardHref] = useState("/dashboard");
  const groups = owner ? ownerNavigation : navigation;
  const active = groups.flatMap(group => group.links).find(link => linkActive(link.href, pathname));
  const displayName = owner ? "Aether owner" : previewCustomer?.name ?? profile.name;
  const initials = displayName.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase() || "MC";
  const searchLinks = groups.flatMap(section => section.links).map(link => ({ ...link, href: link.href === "/dashboard" ? dashboardHref : link.href }));

  function setPlan(action: SetStateAction<string>) {
    changePlan("mira", typeof action === "function" ? action(plan) : action);
  }

  useEffect(() => {
    function openSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMobile(false);
        setSearch(true);
      }
    }
    window.addEventListener("keydown", openSearch);
    return () => window.removeEventListener("keydown", openSearch);
  }, []);

  function reset() {
    setProfile(initialProfile);
    setKeys(initialKeys);
    resetCustomer("mira");
    setConversations(initialConversations);
    setTasks(initialTasks);
    setDashboardHref("/dashboard");
  }

  return <WorkspaceContext.Provider value={{ profile, setProfile, keys, setKeys, plan, setPlan, conversations, setConversations, tasks, setTasks, dashboardHref, setDashboardHref, reset }}>
    <div className="aw aw-shell" data-collapsed={collapsed} data-appearance={profile.appearance.toLowerCase()}>
      <aside className="aw-sidebar">
        <div className="aw-sidebar-brand"><Link href="/" aria-label="Aether home"><BrandWordmark /></Link><Button tone="quiet" className="aw-icon-button" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</Button></div>
        <div className="aw-space-name"><span className="aw-avatar aw-space-avatar">{initials}</span><div><strong>{owner ? "Owner console" : previewCustomer ? "Customer preview" : "Personal workspace"}</strong><small>Demo environment</small></div></div>
        <Navigation pathname={pathname} />
        <Link className="aw-sidebar-foot" href="/designs/agent" title="Product overview" aria-label="Product overview"><CircleHelp size={18} /><span>Product overview</span><ArrowUpRight size={14} /></Link>
      </aside>
      <div className="aw-main-column">
        <header className="aw-topbar">
          <div className="aw-topbar-title"><Button tone="quiet" className="aw-icon-button aw-mobile-trigger" aria-label="Open navigation" onClick={() => setMobile(true)}><Menu size={20} /></Button><span>{active?.title ?? "Workspace"}</span><Badge tone="blue">Demo</Badge></div>
          <button type="button" className="aw-workspace-search-trigger" aria-label="Search workspace" aria-keyshortcuts="Control+k Meta+k" onClick={() => setSearch(true)}><Search size={16} aria-hidden="true" /><span>Search</span><kbd>Ctrl K</kbd></button>
          <details className="aw-profile" key={pathname}>
            <summary aria-label="Account menu"><span className="aw-avatar">{initials}</span><span className="aw-profile-name">{displayName}</span><ChevronDown size={15} /></summary>
            <div className="aw-dropdown"><div><strong>{displayName}</strong><small>{owner ? "Owner frontend preview" : previewCustomer?.email ?? profile.email}</small></div><Link href="/settings"><Settings size={16} /> Account settings</Link><Link href="/pricing"><CreditCard size={16} /> {plan} plan</Link><Link href={owner ? "/dashboard/spending" : "/owner"}><ShieldCheck size={16} />{owner ? "Switch to customer demo" : "Switch to owner demo"}</Link><button type="button" onClick={() => setLogout(true)}><LogOut size={16} /> Sign out of demo</button></div>
          </details>
        </header>
        <main className="aw-content" id="workspace-content">{children}</main>
      </div>
      {mobile && <Dialog title="Aether workspace" className="aw-mobile-drawer" onClose={() => setMobile(false)}><Navigation pathname={pathname} onSelect={() => setMobile(false)} /></Dialog>}
      {search && <WorkspaceSearch links={searchLinks} tasks={owner ? [] : tasks} customers={owner ? customers : []} onClose={() => setSearch(false)} />}
      {logout && <Dialog title="Sign out of the demo?" onClose={() => setLogout(false)}><p className="aw-muted">This ends the current local preview session and resets your demo changes.</p><div className="aw-dialog-actions"><Button onClick={() => setLogout(false)}>Cancel</Button><ActionLink href="/login" tone="primary">Sign out</ActionLink></div></Dialog>}
    </div>
  </WorkspaceContext.Provider>;
}
