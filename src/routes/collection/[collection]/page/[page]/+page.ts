export const load = ({ params, data, url }) => {
    const { collection } = params
    const { pathname } = url
    return { ...data, collection, prefix: `${pathname}/edit`}
}