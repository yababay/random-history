export const csr = true

export const load = async ({ params, data }) => {
    const { id, collection } = params
    const { record } = data
    record.id = id
    return { record, collection }
}
