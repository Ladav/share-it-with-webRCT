import { useEffect, useState } from "react"
import SimplePeer from "simple-peer"

export default function Initiator() {
  const [peer, setPeer] = useState<SimplePeer.Instance>()
  const [signals, setSignals] = useState<object[]>([])
  const [answer, setAnswer] = useState("")
  const [messages, setMessages] = useState<string[]>([])
  const [composedMessage, setComposedMessage] = useState("")

  useEffect(() => {
    if (!peer) {
      const newPeer = new SimplePeer({ initiator: true, trickle: false })

      newPeer.on("signal", (e: SimplePeer.SignalData) => {
        console.log("## SIGNAL", { e })
        setSignals((prev) => [...prev, e])
      })

      newPeer.on("connect", () => {
        console.log("## CONNECTED")
        newPeer.send("Connected")
      })

      newPeer.on("data", (data: Uint8Array) => {
        // Convert the Uint8Array to a Buffer
        const buffer = Buffer.from(data)
        // Convert the Buffer to text using toString() method
        const text = buffer.toString("utf-8")
        setMessages((prev) => [...prev, text])
      })

      setPeer(newPeer)
    }
  }, [signals, peer])

  console.log({ peer, connected: peer?.connected })

  return (
    <div>
      <h1>Initiator Page</h1>
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
              name="answer"
              id="answer"
              onChange={(e) => {
                setAnswer(e.target.value)
              }}
            />
            <button
              onClick={() => {
                peer?.signal(answer)
              }}
            >
              Send Answer
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
