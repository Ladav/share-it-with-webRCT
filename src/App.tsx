import SimplePeer from "simple-peer"
import WebRCTSupportFallback from "./webrct-support-fallback"
import { useMemo, useState } from "react"
import Receiver from "./pages/receiver/receiver"
import Initiator from "./pages/initiator/initiator"
const isWebRCTSupported = SimplePeer.WEBRTC_SUPPORT

function App() {
  const [action, setAction] = useState<"SEND" | "RECEIVE">()

  const content = useMemo(() => {
    if (action === "RECEIVE") {
      return <Receiver />
    }

    if (action === "SEND") {
      return <Initiator />
    }

    return (
      <>
        <h3>Fresh start</h3>
        <button
          onClick={() => {
            setAction("SEND")
          }}
        >
          Send
        </button>
        <button
          onClick={() => {
            setAction("RECEIVE")
          }}
        >
          Receiver
        </button>
      </>
    )
  }, [action])

  return (
    <>
      <h1>Share IT!, with WebRCT</h1>
      <main>{isWebRCTSupported ? content : <WebRCTSupportFallback />}</main>
    </>
  )
}

export default App
