const { ceil, random } = Math

const randomString = () => random().toString(20).substring(2)

export const fill = (l: number) => new Array(l).fill(0)

export const newItem = (id: number | string): Record<string, string> => {
  id = String(id)

  return {
    id,
    description: fill(ceil(random() * 3))
      .map(randomString)
      .join(', '),
    price: (random() * 50).toFixed(2)
  }
}
