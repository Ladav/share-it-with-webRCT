import { useEffect, useState } from "react"
import SimplePeer, { SignalData } from "simple-peer"
import { downloadFile } from "../../utils/download.utils"
import { bufferEndMark, bufferStartMark } from "../initiator"
import { createFileRoute } from "@tanstack/react-router"

let bufferChunks: Uint8Array[] = []

function Receiver() {
  const { offer } = Route.useSearch()
  const [peer, setPeer] = useState<SimplePeer.Instance>()
  const [signals, setSignals] = useState<object[]>([])
  const [composedMessage, setComposedMessage] = useState("")
  const [connected, setConnected] = useState(Boolean(peer?.connected))

  useEffect(() => {
    if (!peer) {
      const newPeer = new SimplePeer({ trickle: false, initiator: false })

      newPeer.on("signal", (e: SimplePeer.SignalData) => {
        console.log("## SIGNAL", { e })
        setSignals((prev) => [...prev, e])
      })

      newPeer.on("error", (err) => {
        console.log("### ERROR", { err })
      })

      newPeer.on("connect", () => {
        console.log("## CONNECTED")
        newPeer.send("connected")
        setConnected(true)
      })

      newPeer.on("data", (data: Uint8Array) => {
        if (data.toString() === bufferStartMark) {
          bufferChunks = []
        } else if (data.toString() === bufferEndMark) {
          downloadFile(bufferChunks, "test-images.jpeg", "image/jpeg")
        } else {
          bufferChunks.push(data)
        }
      })

      setPeer(newPeer)
    }
  }, [signals, peer])

  useEffect(() => {
    if (offer) {
      peer?.signal(offer)
    }
  }, [offer, peer])

  return (
    <div>
      <h1>Receiver Page</h1>
      {connected ? (
        <div>
          <h2>Messsages</h2>
          <div>
            <input
              type="text"
              name="message"
              id="message"
              onChange={(e) => {
                setComposedMessage(e.target.value)
              }}
            />
            <button
              onClick={() => {
                peer?.send(composedMessage)
                setComposedMessage("")
              }}
            >
              Send Answer
            </button>
          </div>
        </div>
      ) : (
        <>
          <p>{JSON.stringify(offer, null, 2)}</p>
          <div>
            <h2>Signals</h2>
            <ul>
              {signals.map((item) => (
                <li key={JSON.stringify(item)}>{JSON.stringify(item, null, 2)}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export const Route = createFileRoute("/receiver/")({
  component: Receiver,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      offer: search.connectionURI ? (JSON.parse(atob(String(search.connectionURI))) as SignalData) : undefined,
    }
  },
})
