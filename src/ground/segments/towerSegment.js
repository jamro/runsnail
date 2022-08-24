import Coin from "../../Coin"
import Stick from "../../Stick"
import GroundEdge from "../GroundEdge"

export default function towerSegment(world, segment) {
  segment.addChild(new GroundEdge(world, segment.start, segment.end))
  const x =  segment.start.x + 1.5
  const y =  segment.start.y 

  for(let i=0; i < segment.data.levels.length; i++) {
    for(let j=0; j < segment.data.levels[i] ; j++) {
      segment.addChild(new Coin(world, x + 3*i, y + 0.5 + j*1.1 ))
      segment.addChild(new Stick(world, 0.9, x - 0.4 + j*0.05 + 3*i, y + 0.45 + j*1.1 ))
      segment.addChild(new Stick(world, 0.9, x + 0.4 -  j*0.05 + 3*i, y + 0.45 + j*1.1 ))
      segment.addChild(new Stick(world, 1 -  j*0.05, x + 3*i, y + 0.95 + j*1.1 , Math.PI/2))
    }
  }
  
}