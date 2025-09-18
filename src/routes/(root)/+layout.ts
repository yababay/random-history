export const load = ({ url }) => {
    const { pathname } = url
    return { isRoot: pathname === '/' }
}