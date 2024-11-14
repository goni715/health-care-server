import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createReviewService } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const { email } = req.headers;
  const result = await createReviewService(email as string, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});






export const ReviewController = {
    createReview
}
