const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in to application')
    await expect(locator).toBeVisible()
    
    const userNameLabel = await page.getByText('username')
    await expect(userNameLabel).toBeVisible()

    const userNameTextbox = await page.getByRole('textbox', { name : 'username' })
    await expect(userNameTextbox).toBeVisible()

    const pswLabel = await page.getByText('password')
    await expect(pswLabel).toBeVisible()

    const pswTextbox = await page.getByRole('textbox', {name : 'password' })
    await expect(pswTextbox).toBeVisible()

    const button = await page.getByRole('button', { name: 'login' })
    await expect(button).toBeVisible()

  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await page.getByTestId('username').fill('root')
        await page.getByTestId('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()

        const message = await page.getByText('root loggedin')
        await expect(message).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('username').fill('root')
        await page.getByTestId('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()
    
        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('root')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })
    
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create a new blog' }).click()
      await page.getByPlaceholder('type title here').fill('test title')
      await page.getByPlaceholder('type author here').fill('test author')
      await page.getByPlaceholder('type url here').fill('example.com')
      await page.getByRole('button', { name: 'create' }).click()
      
      const reviewDiv = await page.locator('.blog-review')
      await expect(reviewDiv).toContainText('test title')
      await expect(reviewDiv).toContainText('test author')
    })
    describe('When blog created', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create a new blog' }).click()
        await page.getByPlaceholder('type title here').fill('test title')
        await page.getByPlaceholder('type author here').fill('test author')
        await page.getByPlaceholder('type url here').fill('example.com')
        await page.getByRole('button', { name: 'create' }).click()
      })
      
      test('the blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        const detailDiv = await page.locator('.blog-detail')
        await expect(detailDiv).toContainText('likes 0')
        await page.getByRole('button', { name: 'like' }).click()
        await expect(detailDiv).toContainText('likes 1')
      })

      test('blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        const detailDiv = await page.locator('.blog-detail')
        await page.waitForSelector('.blog-detail')
        await expect(detailDiv).toContainText('test title')
        page.on('dialog', async dialog => await dialog.accept())
        await page.getByLabel('remove').click()
        await expect(detailDiv).not.toBeVisible() 
      })
    })
    test.describe('When blog created', () => {
      test.beforeEach(async ({ page }) => {
        // Create the first blog
        await page.getByRole('button', { name: 'create a new blog' }).click()
        await page.getByPlaceholder('type title here').fill('test title 1')
        await page.getByPlaceholder('type author here').fill('test author 1')
        await page.getByPlaceholder('type url here').fill('example1.com')
        await page.getByRole('button', { name: 'create' }).click()
  
        // Wait for the blog to be created
        await page.waitForSelector('.blog-review')
  
        // Create the second blog
        await page.getByRole('button', { name: 'create a new blog' }).click()
        await page.getByPlaceholder('type title here').fill('test title 2')
        await page.getByPlaceholder('type author here').fill('test author 2')
        await page.getByPlaceholder('type url here').fill('example2.com')
        await page.getByRole('button', { name: 'create' }).click()
  
        // Wait for the blogs to be rendered
        await page.waitForSelector('.blog-review')
  
         // Like the second blog
        const blogReviewElements = await page.locator('.blog-review')
        await blogReviewElements.nth(1).locator('button', { hasText: 'view' }).click() // View the second blog

        // Wait for the like button to appear and be clickable in the blog details section
        const blogDetailElements = await page.locator('.blog-detail')
        await blogDetailElements.nth(1).locator('button[aria-label="like"]').click() // Like the second blog
      })
  
      test('the blogs are arranged in the order according to the likes', async ({ page }) => {
        // Ensure the blogs are sorted correctly
        const blogDetails = await page.locator('.blog-detail')
  
        // Wait for the page to reflect the state change
        await page.waitForTimeout(2000) // Wait for 2 seconds to ensure state change
  
        const firstBlogTitle = await blogDetails.first().innerText()
        const lastBlogTitle = await blogDetails.last().innerText()
  
        expect(firstBlogTitle).toContain('test title 2')
        expect(lastBlogTitle).toContain('test title 1')
      })
    })
  })
  describe('only the creator sees delete button of the blog', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Superuser',
          username: 'root',
          password: 'salainen'
        }
      })
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Creator',
          username: 'jiawei',
          password: '123456'
        }
      })
  
      await page.goto('http://localhost:5173')
    })
  
    test('only the creator sees delete button of the blog', async ({ page }) => {
      // Log in as root and create a blog
      await page.getByTestId('username').fill('root')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'create a new blog' }).click()
      await page.getByPlaceholder('type title here').fill('test title')
      await page.getByPlaceholder('type author here').fill('test author')
      await page.getByPlaceholder('type url here').fill('example.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()
  
      const deleteButton = await page.getByRole('button', { name: 'remove' })
      await expect(deleteButton).toBeVisible()
      
      await page.screenshot({ path: 'screenshots/after_create.png', fullPage: true })

      // Log out root user
      await page.getByRole('button', { name: 'logout' }).click()
  
      // Log in as jiawei
      await page.getByTestId('username').fill('jiawei')
      await page.getByTestId('password').fill('123456')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'view' }).click()

      await page.screenshot({ path: 'screenshots/after_login_jiawei.png', fullPage: true })
  
      await expect(deleteButton).not.toBeVisible()
      await page.screenshot({ path: 'screenshots/after_check_delete_button_jiawei.png', fullPage: true })
    })
  })
})


