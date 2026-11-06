import { Flex } from "@chakra-ui/react";
import { Outlet, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { initialSpaces, navigationItems, navigationPaths } from "./components/sidebar/data";
import { Sidebar } from "./components/sidebar/sidebar";
import { useAuthStore } from "./stores/auth-store";
import type {
  SidebarSelection,
  SidebarSpace,
} from "./components/sidebar/types";

function App() {
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);
  const pathname = useLocation({ select: (location) => location.pathname });
  const { spaceId, locationId } = useParams({ strict: false });
  const navigate = useNavigate();
  const section = navigationItems.find(({ id }) => {
    const path = navigationPaths[id];
    return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
  })?.id ?? "home";
  const [spaces, setSpaces] = useState<SidebarSpace[]>(initialSpaces);

  const selectLocation = (selection: SidebarSelection) => {
    if (selection.locationId) {
      void navigate({
        to: "/espacos/$spaceId/locais/$locationId",
        params: { spaceId: selection.spaceId, locationId: selection.locationId },
      });
    } else {
      void navigate({ to: "/espacos/$spaceId", params: { spaceId: selection.spaceId } });
    }
  };

  if (!session) return null;

  return (
    <Flex
      minH="100dvh"
      direction={{ base: "column", md: "row" }}
      bg="bg.canvas"
    >
      <Sidebar
        spaces={spaces}
        user={{ ...session.user, avatarUrl: session.user.avatarUrl ?? undefined }}
        onSignOut={signOut}
        activeSection={section}
        selection={spaceId ? { spaceId, locationId } : undefined}
        onSelectLocation={selectLocation}
        onCreateSpace={(name) => {
          const newSpace = { id: crypto.randomUUID(), name, locations: [] };
          setSpaces((previous) => [...previous, newSpace]);
          selectLocation({ spaceId: newSpace.id });
        }}
      />
      <Outlet />
    </Flex>
  );
}

export default App;
