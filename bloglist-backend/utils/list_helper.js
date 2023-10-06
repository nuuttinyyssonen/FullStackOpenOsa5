const blog = require("../models/blog");
const _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let likes = 0;
    for(let i = 0; i < blogs.length; i++) {
        likes += blogs[i].likes
    }
    return likes
}

const favoriteBlog = (blogs) => {
    let mostLikedBlog = null
    let maxLikes = -1
    for(let i = 0; i < blogs.length; i++) {
        if(blogs[i].likes > maxLikes) {
            maxLikes = blogs[i].likes
            mostLikedBlog = blogs[i]
        }
    }
    return mostLikedBlog
}

const mostBlogs = (blogs) => {
    const authorCount = _.countBy(blogs, 'author')
    const mostBlogsAuthor = _.maxBy(_.keys(authorCount), (author) => authorCount[author])
    return {
        author: mostBlogsAuthor,
        blogs: authorCount[mostBlogsAuthor]
    }
}

const mostLikes = (blogs) => {
    const authorLikes = _.groupBy(blogs, 'author')
    const authorTotalLikes = _.mapValues(authorLikes, (authorBlogs) => 
        _.sumBy(authorBlogs, 'likes')
    )

    const mostLikedAuthor = _.maxBy(_.keys(authorTotalLikes), (author) => 
        authorTotalLikes[author]
    )
    
    return {
        author: mostLikedAuthor,
        likes: authorTotalLikes[mostLikedAuthor]
    }
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}