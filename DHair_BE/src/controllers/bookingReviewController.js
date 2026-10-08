const { PrismaClient } = require('@prisma/client');
const service = require('../services/bookingReviewService');
const db = new PrismaClient();

function handle(action) {
  return async (req, res) => {
    try {
      res.json({ success: true, data: await action(req) });
    } catch (error) {
      if (!error.status) console.error('Booking reviews:', error);
      res.status(error.status || 500).json({
        success: false,
        message: error.status ? error.message : 'Không thể xử lý đánh giá. Vui lòng thử lại.',
      });
    }
  };
}

exports.create = handle((req) =>
  service.createReview(db, req.bookingAccountId, req.params.id, req.body || {}),
);
exports.list = handle((req) => service.listReviews(db, req.bookingAccountId, req.query));
