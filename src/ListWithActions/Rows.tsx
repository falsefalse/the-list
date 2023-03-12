import React from 'react'

type Props = {
  row: Record<string, string>
  index: number
  height: number
}

export function Row({ row, index, height }: Props) {
  return (
    <tr style={{ top: index * height }}>
      <td>Item #{row.id}</td>
      <td>{row.description}</td>
      <td>💲{row.price}</td>
    </tr>
  )
}

export function HeaderRow() {
  return (
    <tr>
      <th>Number #️⃣</th>
      <th>Description 🤖</th>
      <th>Price 🎲</th>
    </tr>
  )
}
