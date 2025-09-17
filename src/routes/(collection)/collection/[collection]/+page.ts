import { redirect } from '@sveltejs/kit'

export const load = ({ params }) => {
    const { collection } = params
    throw redirect(302, `/collection/${collection}/page/1`)
}
