import { useEffect, useState } from "react"
import SimplePeer from "simple-peer"
import { downloadFile } from "../../utils/download.utils"
import { bufferEndMark, bufferStartMark } from "../initiator"

let bufferChunks: Uint8Array[] = []

export default function Receiver() {
  const [peer, setPeer] = useState<SimplePeer.Instance>()
  const [signals, setSignals] = useState<object[]>([])
  const [offer, setOffer] = useState("")
  const [composedMessage, setComposedMessage] = useState("")

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

  return (
    <div>
      <h1>Receiver Page</h1>
      {peer?.connected ? (
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
                peer.send(composedMessage)
                setComposedMessage("")
              }}
            >
              Send Answer
            </button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <input
              type="text"
              name="offer"
              id="offer"
              onChange={(e) => {
                setOffer(e.target.value)
              }}
            />
            <button
              onClick={() => {
                peer?.signal(offer)
              }}
            >
              Accept Offer
            </button>
          </div>
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
