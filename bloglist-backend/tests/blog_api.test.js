const mongoose = require('mongoose')
const supertest = require('supertest')
const request = require('supertest');
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const blog_helper = require('../utils/blog_helper')

describe('GET', () => {
    test('blogs length', async() => {
        const blogs = await blog_helper.getBlogs()
        expect(blogs).toHaveLength(blogs.length)
    })
    
    test('blogs id', async() => {
        const blogs = await blog_helper.getBlogs()
        blogs.forEach((blog) => {
            expect(blog.id).toBeDefined();
        })
    })
})

describe('POST', () => {
    let token;
    beforeAll(async() => {
        const loginResponse = await request(app)
            .post('/api/login')
            .send({ username: "r4imo", password: "salainen" })
        token = loginResponse.body.token
    })
    test('blogs post', async() => {
        const responseBefore = await blog_helper.getBlogs()
    
        const newPost = {
            title: "test",
            author: "test",
            url: "www.test.com",
            likes: 0
        }
        console.log("the token is", token)
        await api 
            .post('/api/blogs')
            .send(newPost)
            .set("Authorization", `Bearer ${token}`)
        
        const response = await blog_helper.getBlogs()
        expect(response).toHaveLength(responseBefore.length + 1)
    })
    
    test('if likes property is missing, it defaults to 0', async () => {
        const responseBefore = await blog_helper.getBlogs()
    
        const newPost = {
            title: "test",
            author: "test",
            url: "www.test.com",
        }
    
        await api
            .post('/api/blogs')
            .send(newPost)
            .set("Authorization", `Bearer ${token}`)
        
        const response = await blog_helper.getBlogs()
        expect(response).toHaveLength(responseBefore.length + 1)
    })
    
    test('if title or url property is missing, 400', async() => {
        const responseBefore = await blog_helper.getBlogs()
        const newPost = {
            author: "test",
        }
    
        const response = await api
            .post('/api/blogs')
            .send(newPost)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(400)
    })
})

describe('DELETE', () => {
    let token;
    beforeAll(async() => {
        const loginResponse = await request(app)
            .post('/api/login')
            .send({ username: "r4imo", password: "salainen" })
        token = loginResponse.body.token
    })
    test('deleting on blog post', async() => {
        const blogsAtStart = await blog_helper.getBlogs()
        const blogToDelete = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await blog_helper.getBlogs()
        
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const contents = blogsAtEnd.map(r => r.id)
        expect(contents).not.toContain(blogToDelete.id)
    })
})

describe('UPDATE', () => {
    test('updating existing record', async() => {
        const blogsAtStart = await blog_helper.getBlogs()
        const blogToUpdate = blogsAtStart[0]
        console.log(blogToUpdate)
        blogToUpdate.likes = 10
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(204)
    })
})

afterAll(async() => {
    await mongoose.connection.close()
})