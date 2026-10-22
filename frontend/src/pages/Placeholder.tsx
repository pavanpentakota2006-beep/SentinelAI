import { useLocation } from "react-router-dom";
import { NAV } from "@/nav";
import { EmptyState } from "@/components/ui";

/** Every route resolves from Phase 1; each page is replaced in its own phase. */
export default function Placeholder() {
  const { pathname } = useLocation();
  const item = NAV.find((n) => n.path === pathname);
  return (
    <div>
      <h1 className="text-xl font-semibold">{item?.label ?? "Page not found"}</h1>
      <EmptyState
        title={item ? "This page is built in a later phase" : "Nothing at this address"}
        hint={item ? "Navigation and layout are ready. The data and actions arrive with the backend APIs." : "Check the address or pick a page from the sidebar."}
      />
    </div>
  );
}
