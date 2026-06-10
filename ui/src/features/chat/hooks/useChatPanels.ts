import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Layout,
  PanelImperativeHandle,
  PanelSize,
} from "react-resizable-panels";
import { useChatLayoutStore } from "@/features/chat/stores/useChatLayoutStore";

export function useChatPanels(userId: string | undefined, hasPlan: boolean) {
  const cachedLayout = useChatLayoutStore((state) =>
    userId ? state.users[userId] : undefined,
  );
  const updateUserLayout = useChatLayoutStore(
    (state) => state.updateUserLayout,
  );
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );
  const [mobilePlannerOpen, setMobilePlannerOpen] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [plannerCollapsed, setPlannerCollapsed] = useState(false);
  const chatPanelRef = useRef<PanelImperativeHandle>(null);
  const plannerPanelRef = useRef<PanelImperativeHandle>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateDesktop = () => setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateDesktop);
    return () => mediaQuery.removeEventListener("change", updateDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop || !hasPlan) chatPanelRef.current?.resize("100%");
  }, [hasPlan, isDesktop]);

  const handleLayoutChanged = useCallback(
    (layout: Layout) => {
      if (!userId || !isDesktop || !hasPlan) return;
      if (layout.chat === undefined || layout.planner === undefined) return;
      updateUserLayout(userId, {
        panelLayout: { chat: layout.chat, planner: layout.planner },
      });
    },
    [hasPlan, isDesktop, updateUserLayout, userId],
  );

  const toggleChat = () => {
    const panel = chatPanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  };
  const toggleMobilePlanner = () =>
    setMobilePlannerOpen((current) => !current);

  return {
    cachedLayout,
    updateUserLayout,
    isDesktop,
    mobilePlannerOpen,
    chatCollapsed,
    plannerCollapsed,
    chatPanelRef,
    plannerPanelRef,
    handleLayoutChanged,
    handleChatResize: useCallback(
      (size: PanelSize) => setChatCollapsed(size.inPixels < 1),
      [],
    ),
    handlePlannerResize: useCallback(
      (size: PanelSize) => setPlannerCollapsed(size.inPixels < 1),
      [],
    ),
    toggleChat,
    toggleMobilePlanner,
  };
}
