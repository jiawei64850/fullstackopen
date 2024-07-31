import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'

test("display a blog renders the blog's title and author", () => {
  const blog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'example.com',
    likes: 5
  }

  const user = {
    name: 'Superuser'
  }

  const { container } = render(<Blog blog={blog} user={user}/>)

  const DivAfterClickButton = container.querySelector('.blog-detail')
  expect(DivAfterClickButton).toHaveStyle('display: none')

  const defaultDiv = container.querySelector('.blog-review')
  expect(defaultDiv).not.toHaveStyle('display: none')
  expect(defaultDiv).toHaveTextContent('Go To Statement Considered Harmful')
  expect(defaultDiv).toHaveTextContent('Edsger W. Dijkstra')
  expect(defaultDiv).not.toHaveTextContent('likes 5')
  expect(defaultDiv).not.toHaveTextContent('example.com')

  screen.debug()
})

test('check whether url and like number shown when button clicked', async () => {
  const blog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'example.com',
    likes: 5
  }

  const user = {
    name: 'Superuser'
  }

  const { container } = render(<Blog blog={blog} user={user}/>)

  const defaultDiv = container.querySelector('.blog-review')
  const DivAfterClickButton = container.querySelector('.blog-detail')
  expect(defaultDiv).not.toHaveStyle('display: none')
  const urlElement = screen.getByTestId('url')
  const likesElement = screen.getByTestId('likes')

  expect(urlElement).not.toBeVisible()
  expect(likesElement).not.toBeVisible()

  const userEventInstance = userEvent.setup()
  const button = screen.getByText('view')
  await userEventInstance.click(button)

  
  expect(DivAfterClickButton).not.toHaveStyle('display: none')
  expect(DivAfterClickButton).toHaveTextContent('Go To Statement Considered Harmful')
  expect(DivAfterClickButton).toHaveTextContent('Edsger W. Dijkstra')
  expect(DivAfterClickButton).toHaveTextContent('likes 5')
  expect(DivAfterClickButton).toHaveTextContent('example.com')

  expect(defaultDiv).toHaveStyle('display: none')
  expect(urlElement).toBeVisible()
  expect(likesElement).toBeVisible()

  screen.debug()
})

test('add 2 likes when user click likes button twice', async () => {
  const blog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'example.com',
    likes: 5
  }

  const user = {
    name: 'Superuser'
  }

  const mockHandler = vi.fn()

  render(
    <Blog user={user} blog={blog} updateLikes={mockHandler} deleteSelectedBlog={() => {}} />
  )

  const userEventInstance = userEvent.setup()

  const viewButton = screen.getByText('view')
  await userEventInstance.click(viewButton)

  const button = screen.getByTestId('likes-button')
  await userEventInstance.click(button)
  await userEventInstance.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('add 2 likes when user click likes button twice', async () => {
  const blog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'example.com',
    likes: 5
  }
  
  const user = {
    name: 'Superuser'
  }
  
  const mockHandler = vi.fn()
  
  render(
    <Blog user={user} blog={blog} updateLikes={mockHandler} deleteSelectedBlog={() => {}} />
  )
  
  const userEventInstance = userEvent.setup()
  
  const viewButton = screen.getByText('view')
  await userEventInstance.click(viewButton)
  
  const button = screen.getByTestId('likes-button')
  await userEventInstance.click(button)
  await userEventInstance.click(button)
  
    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()
  
  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('type title here')
  const authorInput = screen.getByPlaceholderText('type author here')
  const urlInput = screen.getByPlaceholderText('type url here')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testing a title...')
  await user.type(authorInput, 'testing a author...')
  await user.type(urlInput, 'testing a url...')
  await user.click(sendButton)
  
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a title...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing a author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing a url...')
  console.log(createBlog.mock.calls)
})