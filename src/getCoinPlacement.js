export default function getCoinPlacement(x) {
  let y = -0.5;
  y += Math.sin(x/9)
  y += Math.sin(x/30)

  return (x > 10  && y > 0)
}