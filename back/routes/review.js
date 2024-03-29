var express = require('express');
var router = express.Router();
var db = require('../db');

//리뷰목록
router.get('/list.json', function(req, res){ //localhost:5000/review/list.json?bid=60
    const bid = req.query.bid;
    const page = req.query.page ? req.query.page : 1; //없으면 기본값을 1로 준다
    const size = req.query.size ? req.query.size : 5; //없으면 기본값을 5로 준다
    const sql = 'call review_list(?,?,?)';
    db.get().query(sql, [bid, page, size], function(err, rows){
        res.send({list:rows[0], total:rows[1][0].total});
    });
});

//리뷰등록
router.post('/insert', function(req, res){
    const uid = req.body.uid;
    const bid = req.body.bid;
    const contents = req.body.contents;
    const sql = 'insert into review(uid,bid,contents) value(?,?,?)';
    db.get().query(sql, [uid, bid, contents], function(err){
        if(err){
            res.send('0');
        }else{
            res.send('1');
        }
    });
});

//리뷰삭제
router.post('/delete', function(req, res){
    const rid = req.body.rid;
    const sql = 'delete from review where rid=?';
    db.get().query(sql, [rid], function(err){
        if(err){
            res.send('0');
        }else{
            res.send('1');
        }
    });
});

//리뷰수정
router.post('/update', function(req, res){
    const rid = req.body.rid;
    const contents = req.body.contents;
    const sql = 'update review set contents=?, regdate=now() where rid=?';
    db.get().query(sql, [contents, rid], function(err){
        if(err){
            res.send('0');
        }else{
            res.send('1');
        }
    });
});

module.exports = router;