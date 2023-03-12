const { ceil, random } = Math

const randomString = () => random().toString(20).substring(2)

export const fill = (l: number) => new Array(l).fill(0)

export const newItem = (i: number): Record<string, string> => {
  // we want to start from 1
  const id = String(i + 1)

  return {
    id,
    description: fill(ceil(random() * 3))
      .map(randomString)
      .join(', '),
    price: (random() * 50).toFixed(2)
  }
}
