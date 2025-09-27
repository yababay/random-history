import fs from 'fs'
import { beforeAll, describe, expect, it } from 'vitest'
import { fileNameFromUrl, downloadImage, attachmentForChat, chatPost } from './upload'

const url = 'https://historical-pictures.website.yandexcloud.net/media/173547344388_0.jpg'
const tmpFn = '/tmp/173547344388_0.jpg'
const fn  = fileNameFromUrl(url)

describe.skip('Chat with image', () => {

    beforeAll(() => {
        if(fs.existsSync(tmpFn)) fs.unlinkSync(tmpFn)
        expect(fs.existsSync(tmpFn)).toBeFalsy()
    })

    it('should have correct file name', async () => {
        expect(fn).eq(tmpFn)
    })

    it('should download', async () => {
        await downloadImage(url)
        expect(fs.existsSync(tmpFn)).toBeTruthy()
    })

    it('should upload', async () => {
        const fn = await downloadImage(url)
        const attachment = await attachmentForChat(fn)
        expect(attachment).matches(/^photo\-(\d+)_(\d+)$/)
    })

    it('should post', async () => {
        const { data } = await chatPost('message with image', url)
        expect(data).toBeTypeOf('object')
        const { response } = data
        expect(response).toBeTypeOf('number')
    })
})
