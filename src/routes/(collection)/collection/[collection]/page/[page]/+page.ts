export const load = ({ params, data, url }) => {
    const { collection, page } = params
    const { pathname } = url
    return { ...data, collection, prefix: `${pathname}/edit`, current: +page }
}