var is = require("istype");
var dbs = require("./db");

function oneday(date) {

    var date = date || new Date();

    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    this.startTime = date.getTime();

    this.endTime = this.startTime + 1000 * 60 * 60 * 24;

}

module.exports = {

    columnList: function (args,callback) {
        var db = dbs.getDB("Column");
        db.find({}).exec(function (err, rs) {
            callback(rs || []);
        })
    },


    columnById: function (args, callback) {
        var db = dbs.getDB("Column");
        db.findOne({
            id: args.id
        }).exec(function (err, rs) {
                callback(rs);
            })
    },

    columnByTopicId: function (args, callback) {
        var tdb = dbs.getDB("Topic");
        var cdb = dbs.getDB("Column");
        tdb.findOne({
            id: args.topicId
        }).exec(function (err, rs) {
                if (rs) {
                    cdb.findOne({
                        id: rs.columnId
                    }).exec(function (err, c) {
                            callback(c);
                        });
                } else {
                    callback(null);
                }
            })
    },

    topicById: function (args, callback) {
        var db = dbs.getDB("Topic");
        db.findOne({
            id: args.id
        }).exec(function (err, rs) {
                callback(rs);
            })
    },

    replyById: function (args, callback) {
        var db = dbs.getDB("Reply");
        db.findOne({
            id: args.id
        }).exec(function (err, rs) {
                callback(rs);
            })
    },

    topicsByColumnId: function (args, callback) {

        var page = args.page;
        var columnId = args.columnId;

        if (columnId) {
            page = parseInt(page);
            page = page > 0 ? page : 1;
            var db = dbs.getDB("Topic");
            db
                .find({
                    columnId: columnId
                })
                .limit(3)
                .sort({
                    createTime: -1
                })
                .skip((page - 1) * 3)
                .exec(function (err, rs) {
                    callback(rs || []);
                })
        } else {
            callback([]);
        }

    },

    topicCountByColumnId: function (args, callback) {
        var columnId = args.columnId;
        var db = dbs.getDB("Topic");
        db.count({columnId: columnId}).exec(function (err, count) {
            callback(count || 0);
        })
    },

    userList: function (args,callback) {
        var db = dbs.getDB("User");
        db.find({}).exec(function (err, rs) {
            callback(rs);
        });
    },

    userById: function (args, callback) {
        var db = dbs.getDB("User");
        db.findOne({
            id: args.id
        }).exec(function (err, rs) {
                callback(rs);
        });
    },

    userByEmail: function (args, callback) {
        var email = args.email;
        var db = dbs.getDB("User");
        db.findOne({
            email: email
        }).exec(function (err, rs) {
                callback(rs);
            });
    },

    userByNick: function (args, callback) {
        var nick = args.nickname;
        var db = dbs.getDB("User");
        db.findOne({
            nickname: nick
        }).exec(function (err, rs) {
                callback(rs);
        });
    },

    userFuzzyExist: function (args, callback) {
        var db = dbs.getDB("User");
        var orq = [];
        for (var k in args) {
            var kv = {};
            kv[k] = args[k];
            orq.push(kv);
        }
        db.count({
            $or: orq
        }).exec(function (err, num) {
                callback(num ? true : false);
            });
    },

    replyCountByToday: function (authorId, callback) {
        var date = new oneday();
        var db = dbs.getDB("Reply");
        db.count({
            authorId: authorId,
            createTime: {
                $gt: date.startTime,
                $lt: date.endTime
            }
        })
            .exec(function (err, num) {
                callback(num || 0);
            });
    },

    topicCountByToday: function (authorId, callback) {
        var date = new oneday();
        var db = dbs.getDB("Topic");
        db.count({
            authorId: authorId,
            createTime: {
                $gt: date.startTime,
                $lt: date.endTime
            }
        })
            .exec(function (err, num) {
                callback(num || 0);
            })
    },

    topicTitleListByUserId: function (userId, page, callback) {
        if (userId) {
            page = parseInt(page);
            page = page > 0 ? page : 1;
            var db = dbs.getDB("Topic");
            db
                .find({
                    authorId: userId
                })
                .limit(3)
                .sort({
                    createTime: -1
                })
                .skip((page - 1) * 3)
                .exec(function (err, rs) {
                    callback(rs || []);
                })
        } else {
            callback([]);
        }
    },

    topicCountByUserId: function (userId, callback) {
        if (userId) {
            var db = dbs.getDB("Topic");
            db
                .count({
                    authorId: userId
                })
                .exec(function (err, rs) {
                    callback(rs || 0);
                })
        } else {
            callback(0);
        }
    },

    replyIdsByUserId: function (userId, page, callback) {
        if (userId) {
            page = parseInt(page);
            page = page > 0 ? page : 1;
            var db = dbs.getDB("Reply");
            db
                .find({
                    authorId: userId
                })
                .limit(3)
                .sort({
                    createTime: -1
                })
                .skip((page - 1) * 3)
                .exec(function (err, rs) {
                    callback(rs || []);
                })
        } else {
            callback([]);
        }
    },


    replyCountByUserId: function (userId, callback) {
        if (userId) {
            var db = dbs.getDB("Reply");
            db
                .count({
                    authorId: userId
                })
                .exec(function (err, rs) {
                    callback(rs || 0);
                })
        } else {
            callback(0);
        }
    },

    messageListByUserId: function (page, userId, callback) {
        if (userId) {
            page = parseInt(page);
            page = page > 0 ? page : 1;
            var db = dbs.getDB("Message");
            db
                .find({
                    targetId: userId
                })
                .limit(3)
                .sort({
                    createTime: -1
                })
                .skip((page - 1) * 3)
                .exec(function (err, rs) {
                    callback(rs || []);
                })
        } else {
            callback([]);
        }
    },

    infoListByUserId: function (page, userId, callback) {
        if (userId) {
            page = parseInt(page);
            page = page > 0 ? page : 1;
            var db = dbs.getDB("Info");
            db
                .find({
                    targetId: userId
                })
                .limit(3)
                .sort({
                    createTime: -1
                })
                .skip((page - 1) * 3)
                .exec(function (err, rs) {
                    callback(rs || []);
                })
        } else {
            callback([]);
        }
    }


}
