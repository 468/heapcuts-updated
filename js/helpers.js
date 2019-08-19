export const randNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const randFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

export const randPlusOrMinus = (num) => {
  return Math.random() < 0.5 ? -num : num
}
