// In-memory stale-while-revalidate store: pages show cached data instantly, then refresh in the background.
export const cache = new Map()
