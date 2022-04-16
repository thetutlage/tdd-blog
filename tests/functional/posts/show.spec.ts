import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { PostFactory } from 'Database/factories'

test.group('Posts show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('return 404 when post does not exists', async ({ client, route }) => {
    const response = await client.get(route('PostsController.show', { id: 1 }))

    response.assertStatus(404)
    response.assertAgainstApiSpec()
  })

  test('get post by id', async ({ client, route }) => {
    const post = await PostFactory.query().with('author').create()
    const response = await client.get(route('PostsController.show', { id: post.id }))

    response.assertStatus(200)
    response.assertAgainstApiSpec()
    response.assertBodyContains({ data: post.toJSON() })
  })
})
