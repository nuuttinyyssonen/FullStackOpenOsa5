import React from "react";
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from "./Blog";
import BlogForm from "./blogForm";

test('renders blog title', () => {
    const blog = {
        title: 'This is a test title...'
    }
    render(<Blog blog={blog} />)
    const element = screen.getByText('This is a test title...')
    expect(element).toBeDefined()
})

test('render url, likes and user when button is clicked', async() => {
    const blog = {
        title: 'This is a test title...',
        url: "www.test.com",
        likes: 0,
    }

    const mockHandler = jest.fn();

    render(
        <Blog blog={blog} toggleVisibility={mockHandler}/>
    )

    const button = screen.getByText('Show')
    await userEvent.click(button)
    
    expect(button).toHaveTextContent('Hide')
})

test('like button pressed 2 times', async() => {
    const blog = {
        title: "This is a test title...",
        url: "www.test.com",
        likes: 0,
    }

    const mockOnClick = jest.fn();


    render(
        <Blog blog={blog} handleLike={mockOnClick}/>
    )

    const show = screen.getByText('Show')
    await userEvent.click(show)

    const likeButton = screen.getByText('like');
    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(mockOnClick).toHaveBeenCalledTimes(2)
    
})

test('new blog post', async() => {

    const createBlog = jest.fn()

    render(<BlogForm handleNewPost={createBlog} />)
    const author = screen.getByPlaceholderText('author')
    const title = screen.getByPlaceholderText('title')
    const url = screen.getByPlaceholderText('url')
    const sendButton = screen.getByText('Create')

    await userEvent.type(author, 'Nuutti Nyyssönen')
    await userEvent.type(title, 'This just a test...')
    await userEvent.type(url, 'www.test.com')
    await userEvent.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
})