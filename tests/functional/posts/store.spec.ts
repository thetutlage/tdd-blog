import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import { UserFactory } from 'Database/factories'

test.group('Posts store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('user must be logged in before creating the post', async ({ client, route }) => {
    const response = await client.post(route('PostsController.store')).form({
      title: 'Hello world',
      content: 'Hello, everyone. This is testing 101',
    })

    response.assertStatus(401)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      errors: [{ message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }],
    })
  })

  test('make sure post title and content is provided', async ({ client, route }) => {
    const user = await UserFactory.query().create()
    const response = await client.post(route('PostsController.store')).loginAs(user)

    response.assertStatus(422)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      errors: [{ message: 'required validation failed', field: 'title' }],
    })
  })

  test('create a post with title and content', async ({ client, route }) => {
    const user = await UserFactory.query().create()
    const response = await client.post(route('PostsController.store')).loginAs(user).form({
      title: 'Hello world',
      content: 'Hello, everyone. This is testing 101',
    })

    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      data: {
        title: 'Hello world',
        content: 'Hello, everyone. This is testing 101',
        author: { id: user.id },
      },
    })
  })

  test('create a post with cover image', async ({ client, route, assert }) => {
    const user = await UserFactory.query().create()
    const { contents, name } = await file.generateJpg('800kb')
    const fakeDrive = Drive.fake()

    const response = await client
      .post(route('PostsController.store'))
      .loginAs(user)
      .fields({
        title: 'Hello world',
        content: 'Hello, everyone. This is testing 101',
      })
      .file('cover_image', contents, { filename: name })

    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      data: {
        title: 'Hello world',
        content: 'Hello, everyone. This is testing 101',
        cover_image: {
          mimeType: 'image/jpeg',
          extname: 'jpg',
        },
        author: { id: user.id },
      },
    })

    assert.isTrue(await fakeDrive.exists(name))
  })

  test('do not allow cover image bigger than 1mb', async ({ client, route, assert }) => {
    const user = await UserFactory.query().create()
    const { contents, name } = await file.generateJpg('2mb')
    const fakeDrive = Drive.fake()

    const response = await client
      .post(route('PostsController.store'))
      .loginAs(user)
      .fields({
        title: 'Hello world',
        content: 'Hello, everyone. This is testing 101',
      })
      .file('cover_image', contents, { filename: name })

    response.assertStatus(422)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      errors: [{ field: 'cover_image', message: 'File size should be less than 1MB' }],
    })

    assert.isFalse(await fakeDrive.exists(name))
  })
})
