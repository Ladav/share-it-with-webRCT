import { useEffect, useState } from "react"
import SimplePeer from "simple-peer"

export default function Receiver() {
  const [peer, setPeer] = useState<SimplePeer.Instance>()
  const [signals, setSignals] = useState<object[]>([])
  const [offer, setOffer] = useState("")
  const [messages, setMessages] = useState<string[]>([])
  const [composedMessage, setComposedMessage] = useState("")

  useEffect(() => {
    if (!peer) {
      const newPeer = new SimplePeer({ trickle: false, initiator: false })

      newPeer.on("signal", (e: SimplePeer.SignalData) => {
        console.log("## SIGNAL", { e })
        setSignals((prev) => [...prev, e])
      })

      newPeer.on("connect", () => {
        newPeer.send("Connected")
      })

      newPeer.on("data", (data: string) => {
        console.log(typeof data)
        // got a data channel message
        console.log("got a message from peer1: " + data)
      })

      newPeer.on("data", (data: Uint8Array) => {
        // Convert the Uint8Array to a Buffer
        const buffer = Buffer.from(data)
        // Convert the Buffer to text using toString() method
        const text = buffer.toString("utf-8")
        console.log({ data })
        setMessages((prev) => [...prev, text])
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
          <ul>
            {messages.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
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
