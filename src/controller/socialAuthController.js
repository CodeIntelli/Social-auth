import { UserModel, TokenModel } from "../models";
import {
    ErrorHandler,
    SendEmail,
    SendToken,
    SuccessHandler,
    CheckMongoID,
    GenerateOTP,
} from "../Services";
import Joi from "joi";
const UserController = {
    // [ + ] REGISTRATION LOGIC
    async registerUser(req, res, next) {
        try {
            const UserRegistration = Joi.object({
                name: Joi.string().trim().min(3).max(30).required().messages({
                    "string.base": `User Name should be a type of 'text'`,
                    "string.empty": `User Name cannot be an empty field`,
                    "string.min": `User Name should have a minimum length of {3}`,
                    "any.required": `User Name is a required field`,
                }),
                email: Joi.string().email().trim().required().messages({
                    "string.base": `User Email should be a type of 'text'`,
                    "string.empty": `User Email cannot be an empty field`,
                    "any.required": `User Email is a required field`,
                }),
                password: Joi.string()
                    .pattern(new RegExp("^[a-zA-Z0-9#?!@$%^&*-]{8,30}$"))
                    .required(),
                // confirmPassword: Joi.ref("password"),
                // For Custom Message we are using this
                confirmPassword: Joi.string().required(),
                verified: Joi.boolean().default(false),
                role: Joi.string().default("user"),
                status: Joi.string().default("Active"),
                userIp: Joi.string().default("0.0.0.0"),
                userLocation: Joi.string().default("Some Location"),
            });

            const { error } = UserRegistration.validate(req.body);
            if (error) {
                return next(error);
            }
            let { name, email, password, confirmPassword, userLocation } = req.body;

            if (req.body.password) {
                if (req.body.password !== req.body.confirmPassword) {
                    return next(
                        ErrorHandler.unAuthorized(
                            "Confirm Password & Password Must Be Same"
                        )
                    );
                }
            }

            try {
                const exist = await UserModel.exists({ email: req.body.email });
                if (exist) {
                    return next(ErrorHandler.alreadyExist("This email is already taken"));
                }
            } catch (err) {
                return next(err);
            }
            let user = await UserModel.create({
                name,
                email,
                password,
                userLocation,
            });
            const token = await TokenModel.create({
                userId: user._id,
                otp: await GenerateOTP(),
            });

            const sendVerifyMail = await SendEmail({
                email: user.email,
                subject: `Email Verification OTP`,
                templateName: "verifyEmailOTP",
                context: {
                    username: user.name,
                    otp: token.otp,
                },
            });
            if (!sendVerifyMail) {
                return next(
                    ErrorHandler.serverError(
                        "Something Error Occurred Please Try After Some Time"
                    )
                );
            }
            // SendToken(user, 201, res);
            res.status(201).json({
                status: "Pending",
                code: 201,
                data: user,
                message:
                    "An Email send to your account please verify your email address",
            });
            // SendToken(user, 201, res, "Account Created Successfully");
        } catch (error) {
            return next(ErrorHandler.serverError(error));
        }
    },

    // [ + ] LOGIN USER LOGIC
    async login(req, res, next) {
        try {
            const LoginSchema = Joi.object({
                email: Joi.string().email().trim().required().messages({
                    "string.base": `User Email should be a type of 'text'`,
                    "string.empty": `User Email cannot be an empty field`,
                    "any.required": `User Email is a required field`,
                }),
                password: Joi.string()
                    .pattern(new RegExp("^[a-zA-Z0-9#?!@$%^&*-]{8,30}$"))
                    .required(),
                userIp: Joi.string().default("0.0.0.0"),
                userLocation: Joi.string().default("Some Location"),
            });
            const { error } = LoginSchema.validate(req.body);
            if (error) {
                return next(error);
            }
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email: email }).select(
                "+password"
            );
            if (!user) {
                return next(
                    ErrorHandler.wrongCredentials("Invalid Email and password")
                );
            }

            if (!user.verified) {
                return next(
                    ErrorHandler.unAuthorized("please verify your email address")
                );
            }

            const isPasswordMatched = await user.comparePassword(password);
            if (!isPasswordMatched) {
                return next(
                    ErrorHandler.wrongCredentials("Invalid Email and password")
                );
            }

            if (user.status === "Deactivate") {
                let message = `To Reactivate Your Account Please Fill this form`;
                const sendActivateAccountInfo = await SendEmail({
                    email: user.email,
                    subject: `Reactivate Your Account`,
                    templateName: "deactivateAccount",
                    context: {
                        username: user.name,
                    },
                });
                if (!sendActivateAccountInfo) {
                    return next(
                        ErrorHandler.serverError(
                            "Something Error Occurred Please Try After Some Time"
                        )
                    );
                }
                const AccountLogin = await SendEmail({
                    email: user.email,
                    subject: `Reset Password Request from ${user.name}`,
                    templateName: "resetPassword",
                    context: {
                        username: user.name,
                    },
                });
                if (!AccountLogin) {
                    return next(
                        ErrorHandler.serverError(
                            "Something Error Occurred Please Try After Some Time"
                        )
                    );
                }
                return next(
                    ErrorHandler.notFound(
                        "It Seem's You have deleted Your Account Please Check Your Mail For More Details"
                    )
                );
            }

            if (user.status === "Blocked") {
                let message = `Administrator Have Blocked Your Account Because Some Inappropriate Activity Has Done From Your Account`;
                const sendActivateAccountInfo = await SendEmail({
                    email: user.email,
                    subject: `Reactivate Your Account`,
                    templateName: "deactivateAccount",
                    context: {
                        username: user.username,
                    },
                });
                if (!sendActivateAccountInfo) {
                    return next(
                        ErrorHandler.serverError(
                            "Something Error Occurred Please Try After Some Time"
                        )
                    );
                }
                return next(
                    ErrorHandler.notFound(
                        "It Seem's Administrator have Blocked Your Account Please Check Your Mail For More Details"
                    )
                );
            }

            // let message = `Someone Is Login From Your Account at User IP:- ${req.socket.remoteAddress} Location:"User Location Here" ${user.userLocation}`;
            let current = new Date();
            let currenttimeDate = `${current.toLocaleTimeString()} - ${current.toLocaleDateString()}`;
            const AccountLogin = await SendEmail({
                email: user.email,
                subject: `Someone Is Login From Your Account`,
                templateName: "loginAccount",
                context: {
                    username: user.username,
                    UserIP: `Ip:- ${req.socket.remoteAddress}`,
                    userLocation: `Location:- ${user.userLocation}`,
                    time: currenttimeDate,
                },
            });
            if (!AccountLogin) {
                return next(
                    ErrorHandler.serverError(
                        "Something Error Occurred Please Try After Some Time"
                    )
                );
            }
            SendToken(user, 200, res, "Login Successfully");
        } catch (error) {
            return next(ErrorHandler.serverError(error));
        }
    },

    // [ + ] LOGOUT LOGIC
    async logout(req, res, next) {
        try {
            res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            });
            res.status(200).json({
                success: true,
                message: "Successfully Logout",
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    },

    // [ + ] GET SINGLE USER LOGIC
    async getSingleUser(req, res, next) {
        try {
            const testId = CheckMongoID(req.params.id);
            if (!testId) {
                return next(ErrorHandler.wrongCredentials("Wrong MongoDB Id"));
            }
            const user = await UserModel.findById(req.params.id);

            if (!user) {
                return next(
                    ErrorHandler.notFound(`User does not exist with Id: ${req.params.id}`)
                );
            }

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(ErrorHandler.serverError(error));
        }
    },
};

export default UserController;
