module.exports = function wrap(app, ctrls) {


    app.get("/",
        ctrls.util.cookieLogin,
        ctrls.data.share,
        function (req, res) {
            res.locals.title = "社区主页"
            res.locals.breadcrumb = "index"
            res.render("index", { loginUser: req.session.user, pageType: "index"});
        });

    app.get("/topic/:id",
        ctrls.topic.access,
        ctrls.util.cookieLogin,
        ctrls.data.share,
        ctrls.data.topicById,
        ctrls.data.columnByTopicId,
        function (req, res) {
            var topic = req.result.data("topic");
            var column = req.result.data("column");
            if (topic) {
                res.locals.topic = topic;
                res.locals.title = topic.title;
                res.locals.column = column;
                res.locals.loginUser = req.session.user;
                res.locals.breadcrumb = "topic"
                res.render("topic");
            } else {
                res.send(404);
            }
        });

    app.get("/user/:id",
        ctrls.util.cookieLogin,
        ctrls.data.share,
        ctrls.data.userById,
        ctrls.util.hasUser,
        function (req, res) {
            if (req.result.hasError()) {
                res.send(404);
            } else {
                res.locals.breadcrumb = "user";
                res.locals.user = req.result.data("user");
                res.locals.title = res.locals.user.nickname+"的个人中心"
                res.locals.loginUser = req.session.user;
                res.render("user");
            }
        });

    app.get("/column/:id/:page?",
        ctrls.util.cookieLogin,
        ctrls.data.share,
        ctrls.data.columnById,
        ctrls.data.topicsByColumnId,
        ctrls.data.topicsInfo,
        function (req, res) {
            res.locals.breadcrumb = "column";
            if (res.locals.column = req.result.data("column")) {
                res.locals.title = res.locals.column.name;

                res.locals.topics = req.result.data("topics");
                res.locals.topicsInfo = req.result.data("topicsInfo");

                var groupNum = 1,
                    groupMaxPageNum = 3,
                    itemNum = 3;

                var count = res.locals.count = req.result.data("count");
                var page = res.locals.page = req.result.data("page");
                res.locals.loginUser = req.session.user;
                var pagenum = res.locals.pagenum = Math.floor(count / itemNum) + ( count % itemNum ? 1 : 0);

                groupNum = Math.floor(page / (groupMaxPageNum - 1)) + ((page % (groupMaxPageNum - 1)) ? 1 : 0);
                res.locals.groupNum = groupNum;
                res.locals.groupMaxPageNum = groupMaxPageNum;
                res.render("column");
            } else {
                res.send(404);
            }
        });

    // doto
    app.get("/setNewPassword",
        function (req, res) {
            res.locals.code = req.param("code");
            res.locals.email = req.param("email");
            res.render("setNewPassword");
        });

    // doto
    app.post("/topic/search",
        ctrls.data.searchTopic,
        function (req, res) {
            var rs = req.result.data("topicList");
            console.log(rs,9999);
            res.send(rs);
        });
}