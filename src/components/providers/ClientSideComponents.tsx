"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/marketing/ChatWidget"), {
  ssr: false,
});
const MouseFollower = dynamic(() => import("@/components/layout/MouseFollower"), {
  ssr: false,
});

export default function ClientSideComponents() {
  return (
    <>
      <ChatWidget />
      <MouseFollower />
    </>
  );
}
