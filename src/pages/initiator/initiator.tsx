import { useEffect, useState } from "react"
import SimplePeer from "simple-peer"

export default function Initiator() {
  const [peer, setPeer] = useState<SimplePeer.Instance>()
  const [signals, setSignals] = useState<object[]>([])
  const [answer, setAnswer] = useState("")

  useEffect(() => {
    if (!peer) {
      const newPeer = new SimplePeer({ initiator: true, trickle: false })

      newPeer.on("signal", (e: SimplePeer.SignalData) => {
        console.log("## SIGNAL", { e })
        setSignals((prev) => [...prev, e])
      })

      newPeer.on("connect", () => {
        console.log("## CONNECTED")
        newPeer.send("whatever" + Math.random())
      })

      setPeer(newPeer)
    }
  }, [signals, peer])

  console.log(peer)

  return (
    <div>
      <h1>Initiator Page</h1>
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
    </div>
  )
}
