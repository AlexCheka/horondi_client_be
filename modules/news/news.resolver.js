const newsService = require('./news.service');
const { NEWS_NOT_FOUND } = require('../../error-messages/news.messages');

const newsQuery = {
  getAllNews: () => newsService.getAllNews(),
  getNewsById: async (parent, args) => {
    const news = await newsService.getNewsById(args.id);
    if (news) {
      return news;
    }
    return {
      statusCode: 404,
      message: NEWS_NOT_FOUND,
    };
  },
};
const newsMutation = {
  addNews: async (parent, args) => {
    try {
      return await newsService.addNews(args.news);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
  deleteNews: async (parent, args) => {
    const news = await newsService.deleteNews(args.id);
    if (news) {
      return news;
    }
    return {
      statusCode: 404,
      message: NEWS_NOT_FOUND,
    };
  },
  updateNews: async (parent, args) => {
    const news = await newsService.updateNews(args.id, args.news);

    if (news) {
      return news;
    }

    return {
      statusCode: 404,
      message: NEWS_NOT_FOUND,
    };
  },
};

module.exports = { newsQuery, newsMutation };
