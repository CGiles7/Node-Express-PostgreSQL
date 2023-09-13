const service = require("./posts.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function postExists(req, res, next) {
  const { postId } = req.params;
  const post = await service.read(postId);
  if (post) {
    res.locals.post = post;
    return next();
  }
  return next({ status: 404, message: `Post cannot be found.` });
}

async function create(req, res, next) {
  const newPost = req.body.data;
  const createdPost = await service.create(newPost);
  res.status(201).json({ data: createdPost });
}

async function update(req, res, next) {
  const { postId } = req.params;
  const updatedPost = req.body.data;
  const result = await service.update(updatedPost, postId);
  if (result.length === 0) {
    return next({ status: 404, message: `Post cannot be found.` });
  }
  res.json({ data: result[0] });
}

async function destroy(req, res, next) {
  const { postId } = req.params;
  const deletedCount = await service.destroy(postId);
  if (deletedCount === 0) {
    return next({ status: 404, message: `Post cannot be found.` });
  }
  res.status(204).json();
}

module.exports = {
  create: asyncErrorBoundary(create),
  update: [asyncErrorBoundary(postExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(postExists), asyncErrorBoundary(destroy)],
};
