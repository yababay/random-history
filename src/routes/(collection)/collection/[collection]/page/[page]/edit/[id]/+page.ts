import { getTitle, type Collection } from "$lib/types"

export const csr = true

export const load = async ({ params, data, fetch }) => {
    const { id, collection } = params
    const { record } = data
    record.id = +id
    const legend = `Из коллекции «${getTitle(collection as Collection)}»`
    return { record, legend, collection }
}
