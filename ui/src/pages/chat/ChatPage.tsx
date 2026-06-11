import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { ChatHeader } from "@/features/chat/components/ChatHeader";
import { ChatLayoutSkeleton } from "@/features/chat/components/ChatLayoutSkeleton";
import { ChatPanel } from "@/features/chat/components/ChatPanel";
import { DesktopPlanner } from "@/features/chat/components/DesktopPlanner";
import { MobilePlanner } from "@/features/chat/components/MobilePlanner";
import { PlanUpdatedToast } from "@/features/chat/components/PlanUpdatedToast";
import { hasCompletePlan } from "@/features/chat/helpers/hasCompletePlan";
import { useChatPanels } from "@/features/chat/hooks/useChatPanels";
import { useChatSession } from "@/features/chat/hooks/useChatSession";
import { useCompactChat } from "@/features/chat/hooks/useCompactChat";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ChatPage() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const chat = useChatSession();
  const hasPlan = hasCompletePlan(chat.programQuery.data);
  const panels = useChatPanels(chat.user?.id, hasPlan);
  const { isDesktop, openMobilePlanner, updateUserLayout } = panels;
  const isInitialLoading =
    chat.chatsQuery.isPending || chat.programQuery.isPending;
  const { contentRef, isCompact } = useCompactChat(isInitialLoading);

  useEffect(() => {
    if (
      !chat.user?.id ||
      !chat.chatsQuery.data ||
      chat.programQuery.data === undefined
    ) {
      return;
    }
    updateUserLayout(chat.user.id, {
      hasChat: chat.chatsQuery.data.messages.length > 0,
      hasPlan,
    });
  }, [
    chat.chatsQuery.data,
    chat.programQuery.data,
    chat.user?.id,
    hasPlan,
    updateUserLayout,
  ]);

  useEffect(() => {
    if (chat.plannerRefreshSignal > 0 && hasPlan && !isDesktop)
      openMobilePlanner();
  }, [chat.plannerRefreshSignal, hasPlan, isDesktop, openMobilePlanner]);

  const logout = () => {
    clearAuth();
    navigate("/", { replace: true });
  };

  if (isInitialLoading) {
    return (
      <ChatLayoutSkeleton
        hasChat={panels.cachedLayout?.hasChat ?? false}
        hasPlan={panels.cachedLayout?.hasPlan ?? false}
        isDesktop={panels.isDesktop}
        panelLayout={panels.cachedLayout?.panelLayout}
      />
    );
  }

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-white">
      <ChatHeader
        hasPlan={hasPlan}
        isDesktop={panels.isDesktop}
        chatCollapsed={panels.chatCollapsed}
        mobilePlannerOpen={panels.mobilePlannerOpen}
        onToggleChat={panels.toggleChat}
        onToggleMobilePlanner={panels.toggleMobilePlanner}
        onLogout={logout}
      />

      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-0 flex-1"
        defaultLayout={
          hasPlan && panels.isDesktop
            ? (panels.cachedLayout?.panelLayout ?? { chat: 44, planner: 56 })
            : { chat: 100 }
        }
        onLayoutChanged={panels.handleLayoutChanged}
      >
        <ResizablePanel
          panelRef={panels.chatPanelRef}
          id="chat"
          defaultSize={hasPlan && panels.isDesktop ? "44%" : "100%"}
          minSize={panels.isDesktop ? "360px" : "100%"}
          collapsible={panels.isDesktop}
          collapsedSize={0}
          onResize={panels.handleChatResize}
          className="flex min-w-0 flex-col bg-white"
        >
          <ChatPanel
            contentRef={contentRef}
            firstName={chat.user?.name?.split(" ")[0]}
            messages={chat.messages}
            isCompact={isCompact}
            isStreaming={chat.isStreaming}
            status={chat.status}
            streamError={chat.streamError}
            answeredWidgets={chat.answeredWidgets}
            customQuestion={chat.customQuestion}
            composerFocusSignal={chat.composerFocusSignal}
            onOpenPlan={panels.openPlanner}
            onSend={chat.send}
            onSelectQuickAnswer={chat.selectQuickAnswer}
            onRequestCustomAnswer={chat.requestCustomAnswer}
          />
        </ResizablePanel>

        {hasPlan && panels.isDesktop && chat.programQuery.data && (
          <>
            <ResizableHandle withHandle className="hidden lg:flex" />
            <ResizablePanel
              panelRef={panels.plannerPanelRef}
              id="planner"
              defaultSize="56%"
              minSize="430px"
              collapsible
              collapsedSize={0}
              onResize={panels.handlePlannerResize}
              className="overflow-hidden"
            >
              <DesktopPlanner
                plan={chat.programQuery.data}
                refreshSignal={chat.plannerRefreshSignal}
                collapsed={panels.plannerCollapsed}
                isUpdating={chat.isPlannerUpdating}
                onClose={panels.closePlanner}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <MobilePlanner
        plan={chat.programQuery.data}
        open={hasPlan && !panels.isDesktop && panels.mobilePlannerOpen}
        refreshSignal={chat.plannerRefreshSignal}
        isUpdating={chat.isPlannerUpdating}
        onClose={panels.toggleMobilePlanner}
      />
      <PlanUpdatedToast visible={chat.showPlanUpdatedToast} />
    </div>
  );
}
