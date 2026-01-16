const breaks = {
  deleteBreak: `mutation DeleteBreak($breakId: ID!) {
    deleteBreak(breakId: $breakId)
  }`
}
export default breaks;
