const Comments = require('./comment.model');
const Product = require('../product/product.model');
const { PRODUCT_NOT_FOUND } = require('../../error-messages/products.messages');

class CommentsService {
  getCommentById(id) {
    return Comments.findById(id);
  }

  async getAllCommentsByProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error(PRODUCT_NOT_FOUND);
    }
    return Comments.find({ product: id });
  }

  updateComment(id, comments) {
    return Comments.findByIdAndUpdate(id, comments, { new: true });
  }

  addComment(data) {
    const comments = new Comments(data);
    return comments.save();
  }

  deleteComment(id) {
    return Comments.findByIdAndDelete(id);
  }

  async addRate(id, data) {
    const product = await Product.findById(id);
    let { rateCount } = product;
    const rateSum = product.rate * rateCount + data.rate;
    const newRate = rateSum / ++rateCount;

    return Product.findByIdAndUpdate(
      id,
      {
        rate: newRate,
        rateCount: rateCount++,
        userRates: [...product.userRates, data],
      },
      { new: true },
    );
  }

  async updateRate(id, data) {
    const product = await Product.findById(id);
    const { rateCount, userRates } = product;
    const votedUser = userRates.find(({ user }) => String(user) === data.user);
    const rateSum = product.rate * rateCount - votedUser.rate + data.rate;
    const newRate = rateSum / rateCount;

    const newUserRates = userRates.map(item => (String(item.user) === String(votedUser.user)
      ? { user: item.user, rate: data.rate }
      : item));

    return Product.findByIdAndUpdate(
      id,
      {
        rate: newRate,
        userRates: newUserRates,
      },
      { new: true },
    );
  }
}
module.exports = new CommentsService();
