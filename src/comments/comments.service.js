const knex = require("../db/connection");

function list() {
  return knex("comments").select("*");
}

function listCommenterCount() {
  return new Promise((resolve, reject) => {
    knex('comments')
      .join('users', 'comments.commenter_id', 'users.user_id') // Updated join conditions
      .select('users.user_email as commenter_email')
      .count('comments.comment_id as count') // Removed alias
      .groupBy('commenter_email')
      .orderBy('commenter_email')
      .then((result) => {
        // Convert the count to a number
        const formattedResult = result.map((row) => ({
          commenter_email: row.commenter_email,
          count: parseInt(row.count),
        }));
        resolve(formattedResult);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function read(commentId) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await knex('comments')
        .select(
          'comments.comment_id',
          'comments.comment',
          'users.user_email as commenter_email',
          'posts.post_body as commented_post'
        )
        .where('comments.comment_id', commentId)
        .leftJoin('users', 'users.user_id', 'comments.commenter_id') // Updated join condition
        .leftJoin('posts', 'posts.post_id', 'comments.post_id') // Updated join condition
        .first();

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  list,
  listCommenterCount,
  read,
};
