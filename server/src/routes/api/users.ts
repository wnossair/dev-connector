import express, { Request, Response } from "express";
import passport from "passport";
import { registerValidation, loginValidation } from "../../middleware/validation.js";
import { sendSuccess } from "../../utils/responseHandler.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { IRegisterRequest, ILoginRequest } from "../../types/index.js";
import { getCurrentUserResponse, loginUser, registerUser } from "../../services/authService.js";

const router = express.Router();

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req: Request, res: Response) => {
  sendSuccess(res, 200, "Users Works");
});

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  registerValidation,
  validateRequest,
  asyncHandler(async (req: Request<{}, {}, IRegisterRequest>, res: Response) => {
    const userResponse = await registerUser(req.body);
    sendSuccess(res, 201, "User registered successfully", { user: userResponse });
  }),
);

// @route   POST api/users/login
// @desc    Login user / returning JWT Token
// @access  Public
router.post(
  "/login",
  loginValidation,
  validateRequest,
  asyncHandler(async (req: Request<{}, {}, ILoginRequest>, res: Response) => {
    const token = await loginUser(req.body);
    sendSuccess(res, 200, "Login successful", { token });
  }),
);

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const currentUser = getCurrentUserResponse(req.user!);
    sendSuccess(res, 200, "Current user fetched successfully", { user: currentUser });
  }),
);

export default router;
