const knex = require("../db/connection");

function create(post) {
  return knex("posts")
    .insert(post)
    .returning("*")
    .then(([createdPost]) => {
      return createdPost;
    });
}

function read(postId) {
  return knex("posts").select("*").where({ post_id: postId }).first();
}

function update(updatedPost, postId) {
  return knex("posts")
    .where({ post_id: postId })
    .update(updatedPost)
    .returning("*");
}

function destroy(postId) {
  return knex("posts").where({ post_id: postId }).del();
}

module.exports = {
  create,
  read,
  update,
  destroy,
};
