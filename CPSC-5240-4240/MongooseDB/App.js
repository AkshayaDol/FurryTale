"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express = require("express");
var bodyParser = require("body-parser");
var AccountModel_1 = require("./model/AccountModel");
var PostModel_1 = require("./model/PostModel");
var crypto = require("crypto");
var CommentModel_1 = require("./model/CommentModel");
var AchievementModel_1 = require("./model/AchievementModel");
var VerificationBadgeModel_1 = require("./model/VerificationBadgeModel");
var UserModel_1 = require("./model/UserModel");
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.expressApp = express();
        this.middleware();
        this.routes();
        this.Account = new AccountModel_1.AccountModel();
        this.Comment = new CommentModel_1.CommentModel();
        this.Achievement = new AchievementModel_1.AchievementModel();
        this.VerificationBadge = new VerificationBadgeModel_1.VerificationBadgeModel();
        this.Post = new PostModel_1.PostModel();
        this.User = new UserModel_1.UserModel();
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    };
    // Configure API endpoints.
    // ACCOUNT
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        router.use(function (req, res, next) {
            res.append('Access-Control-Allow-Origin', ['*']);
            res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.append('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
        router.get('/account/', function (req, res) {
            console.log("why?");
            _this.Account.retrieveAllAccounts(res);
        });
        router.post('/account/', function (req, res) {
            var accountId = crypto.randomBytes(16).toString("hex");
            var userId = crypto.randomBytes(16).toString("hex");
            var jsonObj = req.body;
            var accountJsonObj = {
                "accountId": accountId,
                "userId": userId,
                "accountType": jsonObj.accountType,
                "payment": jsonObj.payment
            };
            var userJsonObj = {
                "userId": userId,
                "userName": jsonObj.userName,
                "userPassword": jsonObj.userPassword,
                "accountId": accountId,
                "tailers": [],
                "tailee": [],
                "about": jsonObj.about,
                "achievement": [],
                "posts": [],
                "openToWork": jsonObj.openToWork,
                "verified": jsonObj.verified,
                "verificationBadgeId": jsonObj.verificationBadgeId,
                "email": jsonObj.email,
                "profilePic": jsonObj.profilePic
            };
            _this.Account.model.create([accountJsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            _this.User.model.create([userJsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send(userJsonObj);
        });
        router.put('/updateAccountType', function (req, res) {
            var jsonObj = req.body;
            _this.Account.updateAccountType(jsonObj, res);
        });
        //USER
        router.get('/users/', function (req, res) {
            console.log("Here are users");
            _this.User.retrieveAllUsers(res);
        });
        router.put('/user/updateUser/', function (req, res) {
            console.log("came to update user");
            var jsonObj = req.body;
            _this.User.updateUser(jsonObj, res);
        });
        router.put('/user/addTailer', function (req, res) {
            var tailerId = req.body.tailerId;
            var taileeId = req.body.taileeId;
            _this.User.addTailer(tailerId, taileeId, res);
        });
        router.get('/openToWork/', function (req, res) {
            console.log("Here are users");
            _this.User.retrieveAllUsersOpenToWork(res);
        });
        router.get('/oneUser', function (req, res) {
            console.log("Here is your post");
            _this.User.retireveOneUser(req.query.userId.toString(), res);
        });
        // COMMENT
        router.get('/comment/', function (req, res) {
            console.log("Your stupid comments!");
            _this.Comment.retrieveAllComments(res);
        });
        router.post('/comment/', function (req, res) {
            var commentId = crypto.randomBytes(16).toString("hex");
            var jsonObj = req.body;
            jsonObj.commentId = commentId;
            _this.Comment.model.create([jsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send('{"Comment Id is":"' + commentId + '"}');
        });
        router.put('/updateComment', function (req, res) {
            var jsonObj = req.body;
            _this.Comment.updateComment(jsonObj, res);
        });
        router.delete('/comment/delete', function (req, res) {
            _this.Comment.deleteComment(req.query.commentId.toString(), res);
        });
        // ACHIEVEMENT
        router.get('/achievement/', function (req, res) {
            console.log("Better your achievment worth it!");
            _this.Achievement.retrieveAllAchievement(res);
        });
        router.get('/oneUserAchievement', function (req, res) {
            console.log("Here is one user achievement");
            var userId = req.query.userId.toString();
            _this.Achievement.retrieveAchievementByUserId(userId, res);
        });
        router.post('/achievement/', function (req, res) {
            var achievementId = crypto.randomBytes(16).toString("hex");
            var jsonObj = req.body;
            jsonObj.achievementId = achievementId;
            _this.Achievement.model.create([jsonObj], function (err) {
                if (err) {
                    console.log('achievement creation failed');
                }
                else {
                    var gettingUserQuery = _this.User.model.findOne({ userId: jsonObj.userId });
                    gettingUserQuery.exec(function (err, item) {
                        console.log('achievement adding started');
                        item.achievement.push(achievementId);
                        console.log('achievement adding ended');
                        console.log(item.achievement);
                        var queryUpdateUser = _this.User.model.findOneAndUpdate({ userId: jsonObj.userId }, item, {
                            new: true
                        });
                        console.log('Starting updating user');
                        queryUpdateUser.exec(function (error, updatedUser) {
                            if (error) {
                                console.log('User updating failed');
                            }
                            console.log(error);
                            res.send("Added achievement");
                        });
                    });
                }
            });
        });
        //VERIFICATION BADGE
        router.get('/verificationBadge/', function (req, res) {
            console.log("Here is your verification badge docs!");
            _this.VerificationBadge.retrieveAllVerificationBadge(res);
        });
        router.post('/verificationBadge/', function (req, res) {
            var verificationBadgeId = crypto.randomBytes(16).toString("hex");
            var userId = crypto.randomBytes(16).toString("hex");
            var jsonObj = req.body;
            jsonObj.verificationBadgeId = verificationBadgeId;
            jsonObj.userId = userId;
            _this.VerificationBadge.model.create([jsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send('{"Verification Badge Id is":"' + verificationBadgeId + '"}');
        });
        //POST
        router.get('/posts/', function (req, res) {
            console.log("Here are your posts");
            _this.Post.retrieveAllPosts(res);
        });
        router.get('/oneUsersPosts', function (req, res) {
            console.log("Here is one user posts");
            var userId = req.query.userId.toString();
            _this.Post.retrievePostsByUserId(userId, res);
        });
        router.get('/onePost', function (req, res) {
            console.log("Here is your post");
            _this.Post.retireveOnePost(req.query.postId.toString(), res);
        });
        router.post('/posts/', function (req, res) {
            var postId = crypto.randomBytes(16).toString("hex");
            var jsonObj = req.body;
            jsonObj.postId = postId;
            _this.Post.model.create([jsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send('{"Post Id is":"' + postId + '"}');
        });
        router.put('/updatePost/', function (req, res) {
            console.log("Staterted Updating");
            var jsonObj = req.body;
            var postId = jsonObj.postId;
            _this.Post.updatePost(postId, jsonObj, res);
        });
        router.put('/updatePostPaw/', function (req, res) {
            console.log("Staterted Updating Post Paw");
            var jsonObj = req.body;
            var postId = jsonObj.postId;
            var pawerUserId = jsonObj.pawerUserId;
            _this.Post.updatePostPaw(postId, pawerUserId, res);
        });
        this.expressApp.use('/', router);
        //this.expressApp.use('/app/json/', express.static(__dirname+'/app/json'));
        this.expressApp.use('/images', express.static(__dirname + '/pages/Images'));
        this.expressApp.use(express.static(__dirname + '/dist/furry-tale-ng'));
        this.expressApp.use('/*', function (req, res) {
            res.sendFile(__dirname + '/dist/furry-tale-ng/index.html');
        });
    };
    return App;
}());
exports.App = App;
