export function formatRating(value) {
  return value == null ? 'No ratings' : Number(value).toFixed(1)
}
