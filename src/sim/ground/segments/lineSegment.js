import GroundEdge from "../GroundEdge"

export default function lineSegment(world, segment) {
  const edge = new GroundEdge(world, segment.start, segment.end)
  segment.addEdge(edge)
}