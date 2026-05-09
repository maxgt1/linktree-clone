import PocketBase from 'pocketbase'

const url = import.meta.env.DEV ? '/' : import.meta.env.VITE_POCKETBASE_URL

const pb = new PocketBase(url)

export default pb
