const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer.js');

const Post = require('./models/Post.js');

routes.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.send(posts);
})

routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {
    const post = await Post.create({
        name: req.file.originalname,
        size: req.file.size,
        key: req.file.key,
        url: req.file.location !== null ? req.file.location : ""
    });
    res.send(post);
});

routes.delete('/posts/:idPost', async (req, res) => {
    const idPost = req.params.idPost;
    const post = await Post.findById(idPost);
    await post.remove();
    res.end();
});

module.exports = routes;