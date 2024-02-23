import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import SimplePeer from "simple-peer"
import WebRCTSupportFallback from "../components/webrct-support-fallback"

const isWebRCTSupported = SimplePeer.WEBRTC_SUPPORT

function Home() {
  return (
    <>
      <h1>Share IT!, with WebRCT</h1>
      <main>
        {isWebRCTSupported ? (
          <>
            <h3>Fresh start</h3>
            <Link to="/initiator" style={{ marginRight: "16px" }}>
              Send
            </Link>
            <Link to="/receiver">Receiver</Link>
          </>
        ) : (
          <WebRCTSupportFallback />
        )}
      </main>
      <Outlet />
    </>
  )
}

export const Route = createFileRoute("/")({
  component: Home,
})
