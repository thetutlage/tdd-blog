import Post from 'App/Models/Post'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class PostsController {
  public async index({ request }: HttpContextContract) {
    const page = 1
    const perPage = request.input('per_page') || 20
    return Post.query().preload('author').orderBy('id', 'desc').paginate(page, perPage)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const { title, content, cover_image } = await request.validate({
      schema: schema.create({
        title: schema.string([rules.trim(), rules.escape()]),
        content: schema.string([rules.trim()]),
        cover_image: schema.file.optional({ extnames: ['jpeg', 'jpg', 'png'], size: '1mb' }),
      }),
    })

    const post = await auth.user!.related('posts').create({
      title,
      content,
      coverImage: cover_image ? Attachment.fromFile(cover_image) : null,
    })
    post.$setRelated('author', auth.user!)

    response.created({
      data: post,
    })
  }

  public async show({ request }: HttpContextContract) {
    const post = await Post.findOrFail(request.param('id'))
    await post.load('author')

    return {
      data: post,
    }
  }
}
