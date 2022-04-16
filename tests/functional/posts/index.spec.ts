import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Post from 'App/Models/Post'
import { UserFactory } from 'Database/factories'

test.group('Posts index', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('return empty list when there are no posts', async ({ client }) => {
    const response = await client.get('/posts')

    response.assertAgainstApiSpec()
    response.assertBodyContains({ meta: { total: 0 }, data: [] })
  })

  test('get a paginated list of existing posts', async ({ client, assert }) => {
    await UserFactory.query().with('posts', 40).create()
    const response = await client.get('/posts')

    response.assertAgainstApiSpec()
    response.assertBodyContains({ meta: { total: 40, per_page: 20, current_page: 1 } })

    const posts = await Post.query().limit(20).preload('author').orderBy('id', 'desc')
    assert.containsSubset(
      response.body().data,
      posts.map((row) => row.toJSON())
    )
  })

  test('define custom per page result set', async ({ client, assert }) => {
    await UserFactory.query().with('posts', 40).create()
    const response = await client.get('/posts').qs({ per_page: 40 })

    response.assertAgainstApiSpec()
    response.assertBodyContains({ meta: { total: 40, per_page: 40, current_page: 1 } })

    const posts = await Post.query().limit(20).preload('author').orderBy('id', 'desc')
    assert.containsSubset(
      response.body().data,
      posts.map((row) => row.toJSON())
    )
  })
})
