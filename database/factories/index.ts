import Factory from '@ioc:Adonis/Lucid/Factory'
import Post from 'App/Models/Post'
import User from 'App/Models/User'

export const PostFactory = Factory.define(Post, ({ faker }) => {
  return {
    title: faker.lorem.words(5),
    content: faker.lorem.paragraphs(3),
  }
})
  .relation('author', () => UserFactory)
  .build()

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    fullName: faker.name.findName(),
  }
})
  .relation('posts', () => PostFactory)
  .build()
