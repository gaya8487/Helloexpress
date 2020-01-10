var express = require('express');
var app = express();


var router = express.Router();
const mysql = require("mysql");   // mysql 모듈 require
mysql.createConnection({multipleStatements: true});

var fs = require('fs'); //파일 로드 사용




// const xhr = new XMLHttpRequest();
var url = 'http://api.openweathermap.org/data/2.5/weather'; /*URL*/
var queryParams;




/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });


// });

//  router.get('/', function (req, res, next) {
//    res.render('myIndex', {

//    });

//  });

 router.get('/', function (req, res, next) {

  res.render('indextest', {

  });

});



// router.get('/:city', function (req, res, next) {

// });


router.get('/checkpw/:id', function (req, res, next) {

  var postId = req.params.id;


  res.render('checkpw', {
    
    results:postId
    
  });

});

// 커넥션 연결
let client = mysql.createConnection({
  user: "java",
  password: "java",
  database: "study"
})

module.exports = router;


// router.get('/create', function (req, res, next) {
//   client.query("SELECT id, name, content, DATE_FORMAT(writtenTime , '%Y-%m-%d %H:%i:%s') as date FROM board", function (err, result, fields) {
//     if (err) {
//       console.log(err);
//       console.log("쿼리문에 오류가 있습니다.");
//     }
//     else {
//       // console.log(result);
//       console.log(result.length);
//       res.render('create', {
        
//         results: result
//       });
//     }
//   });
// });

router.get('/create', function (req, res, next) {

  //http://127.0.0.1:3000/create?id=1

  var page_size = 10; //한페이지 당

  var page_list_size = 10;  //페이지의 갯수 : 1 ~ 10개 페이지


  var curPage = req.query.id; // 페이지 넘버
  var totalPageCount = 0; //게시물 전체 갯수
  // var curPage = num; // 현재 페이지
  var no = "";

   console.log("aa"+curPage);

  

  var sql2 ="select count(*) cnt from board";

  // client.query("select count(*) cnt from board", function(err, result, fields) {
  //   totalPageCount = result[0].cnt;
  // });


  client.query(sql2, function (err, result, fields) {
    if (err) {
      console.log(err);
      console.log("쿼리문에 오류가 있습니다.");
    }
    else {
  
     totalPageCount = result[0].cnt;


     console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);
      
     //전체 페이지 갯수
      if (totalPageCount < 0) {
        totalPageCount = 0
      }

      var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
      var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
      var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
      var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
      var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


      //현재페이지가 0 보다 작으면
      if (curPage < 0) {
        no = 0
      } else {
        //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
        no = (curPage - 1) * 10
      }

      console.log('[0] curPage 현재 페이지 : ' + curPage + ' | [1] page_list_size  페이지의 갯수 : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

      var result2 = {
        "curPage": curPage,
        "page_list_size": page_list_size,
        "page_size": page_size,
        "totalPage": totalPage,
        "totalSet": totalSet,
        "curSet": curSet,
        "startPage": startPage,
        "endPage": endPage
      };

      var sql = "SELECT id, name, content, DATE_FORMAT(writtenTime , '%Y-%m-%d %H:%i:%s') as date FROM board order by id desc"
        if (curPage != null) {
          sql = "SELECT id, name, content, DATE_FORMAT(writtenTime , '%Y-%m-%d %H:%i:%s') as date FROM board  order by id desc LIMIT "+no+","+page_size;
        }

      client.query(sql, function (error, result) {
            if (error) {
              console.log("페이징 에러" + error);
              return
            }else{
              res.render('create', {
                totalcnt: totalPageCount,
                results: result,
                pasing:result2
              });


            }
      
        });
        

    }
  });

});





router.post('/create', function (req, res, next) {
  var body = req.body;

  client.query("INSERT INTO board (name, pw, content) VALUES (?, ?, ?)", [
    body.name, body.pw, body.content
  ], function () {
     res.redirect("/create?id=1");

  });
});

router.post('/delete/:id', function (req, res, next) {

  var postId = req.params.id; // req.params 프로퍼티 -  path variables 값을
  var check_pw = req.body.check_pw //포스트 바디의 값

  client.query("DELETE FROM board WHERE id=? AND pw=?", [
    postId,check_pw
  ], function (err, result, fields) {
    if (err) {
      console.log(err);
      console.log("쿼리문에 오류가 있습니다.");
    }
    else if(result.affectedRows==1){

      console.log("삭제 성공");
    
       res.render('checkpw', {
         results: true
      });
    } else if(result.affectedRows==0){
      console.log("비밀번호 오류");
    
      res.render('checkpw', {
        results: false
     });
    }

  

  });
});



