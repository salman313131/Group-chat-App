const cron = require('node-cron');
const Chat = require('../modal/chat')
const ArchivedChat = require('../modal/archievechat')

const startCronJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const oldMessages = await Chat.findAll({
        where: { createdAt: { $lt: oneDayAgo } },
      });

      await ArchivedChat.bulkCreate(oldMessages);

      await Chat.destroy({
        where: { createdAt: { $lt: oneDayAgo } },
      });

      console.log('Old messages moved and deleted successfully.');
    } catch (error) {
      console.error('Error while moving and deleting old messages:', error);
    }
  });
};

module.exports = startCronJob ;
