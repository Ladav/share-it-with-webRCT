import { useEffect, useState } from "react"
import SimplePeer from "simple-peer"

export default function Receiver() {
  const [peer, setPeer] = useState<SimplePeer.Instance>()
  const [signals, setSignals] = useState<object[]>([])
  const [offer, setOffer] = useState("")

  useEffect(() => {
    if (!peer) {
      const newPeer = new SimplePeer({ trickle: false, initiator: false })
      newPeer.on("signal", (e: SimplePeer.SignalData) => {
        console.log("## SIGNAL", { e })
        setSignals((prev) => [...prev, e])
      })
      newPeer.on("connect", () => {
        console.log("## CONNECTED")
      })
      newPeer.on("data", (data: string) => {
        console.log(typeof data)
        // got a data channel message
        console.log("got a message from peer1: " + data)
      })
      setPeer(newPeer)
    }
  }, [signals, peer])

  return (
    <div>
      <h1>Receiver Page</h1>
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
    </div>
  )
}
