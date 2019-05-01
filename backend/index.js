const express = require('express');
const app = express();
const port = 8889;
const bodyParser = require('body-parser');
var multer = require('multer');

var jsonfile = require('jsonfile');
const path =require('path');
const fs = require('fs');
const Dpath = `/Users/pallavi/college/PsychometricAnalysisWebtool/Datastore/`;


var Storage = multer.diskStorage({
   destination: function(req, file, callback) {
      
      //console.log(req.user);
      if(req.testname)
      {
      callback(null, `${Dpath}/${req.testname}/`+`Images2/`);
      }
      else
      {
      callback(null, `${Dpath}/Ferimages/`);
      }
   },
   filename: function(req, file, callback) {
      console.log(file,"heheheh");
       callback(null, file.originalname );
   }
});


var upload = multer({
   storage: Storage
}).array("imgUploader", 100);


let userexist = JSON.stringify({
   error:true,
   msg:"User already exist"
});
let usernotexist = JSON.stringify({
   error:true,
   msg:"User not exist"
});


function getImages(imageDir, callback) {
   var fileType1 = '.jpg';
   var fileType2 = '.png';
   var fileType3 = '.jpeg';
   var files = [], i;
   fs.readdir(imageDir, function (err, list) {
       for(i=0; i<list.length; i++) {
           if(path.extname(list[i]) === fileType1 || path.extname(list[i]) === fileType2 || path.extname(list[i]) === fileType3) {
               files.push(list[i]); //store the file name into the array files
           }
       }
       callback(err, files);
   });
}

app.listen(port,()=> {
    console.log("hey we are live on port",port);
   app.use(bodyParser.urlencoded({
      extended: true
   }));
  // app.use(cors);
   app.use(bodyParser.json());
   app.use(function (req,res,next) {
      //next();
      res.header("Access-Control-Allow-Origin","*");
      res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
      next();
   });


   app.post('/uploadtest/:testname/',function(req, res){
      //console.log("quesans upload k ander");
      let testname= req.params.testname;
      req.testname = req.params.testname ;
      jsonfile.readFile(`${Dpath}/tests.json`,(err,obj)=>{
         if(!err)
         {
            if(obj['tests'].includes(testname))
            {
               res.send(JSON.stringify({
                  error:true,
                  msg:"try alternate test name"
               }));
            }
            else{

               x=obj;
               x['tests'].push(testname);
               jsonfile.writeFileSync(`${Dpath}/tests.json`,x,{spaces:2});
               let json=req.body;
               //let json=req.body;
               //console.log(json);
               const folderName = `${Dpath}/${testname}/Images2`;
               try {
                  if (!fs.existsSync(folderName)){
                     fs.mkdirSync(folderName,{recursive: true});
                  }
                  } catch (err) {
                  console.error(err)
                  }
               
               fs.openSync(`${Dpath}/${testname}/`+"quesans1.json",'w');
               fs.writeFileSync(`${Dpath}/${testname}/`+"quesans1.json", JSON.stringify(json.data1), {spaces:2},function(err, result) {
                  if(err) console.log('error', err);
                  res.send(JSON.stringify({
                     error:true,
                     msg:"password not right"
                  }));
               });
               fs.openSync(`${Dpath}/${testname}/`+"quesans3.json",'w');
               fs.writeFileSync(`${Dpath}/${testname}/`+"quesans3.json", JSON.stringify(json.data2), {spaces:2},function(err, result) {
                  if(err) console.log('error', err);
                  res.send(JSON.stringify({
                     error:true,
                     msg:"password not right"
                  }));
               });
            }
         }
         else{
            res.send(JSON.stringify({
               error:true,
               msg:"tests cannot be read"
            }));
         }
      });

   });

   app.post("/upload/:testname/", function(req, res) {
      let testname= req.params.testname;
      req.testname = req.params.testname ;
      const folderName = `${Dpath}/${testname}/Images2`;
      try {
         if (!fs.existsSync(folderName)){
            fs.mkdirSync(folderName,{recursive: true});
         }
         } catch (err) {
         console.error(err)
         }
      //console.log("image upload k ander");
      
      upload(req, res, function(err) {
          if (err) {
             console.log(err);
              return res.end("Something went wrong!");
          }
          return res.end("File uploaded sucessfully!");
      });
   });

   app.post("/getResultsThree/",  function(req,res){
      jsonfile.readFile(`${Dpath}/phase3result.json`,(err,obj)=>{         
         if(!err){
            res.send(JSON.stringify({
               error:false,
               msg:"Found the file",
               response:obj
            }));
         }
         else
         {
            console.log("yes error give eeror");
            res.send(JSON.stringify({
               error:true,
               msg:err
            }));
         }
      });
   })
   app.post("/uploadfer/", function(req, res) {
      //console.log("image upload k ander");
      upload(req, res, function(err) {
          if (err) {
             console.log(err);
              return res.end("Something went wrong!");
          }
          return res.end("File uploaded sucessfully!");
      });
   });

   app.get('/getimage/:test/:image',(req,res)=>{
      let test = req.params.test;
      let image = req.params.image;
      res.sendFile(`${Dpath}/${test}/Images2/${image}`);
   })

   app.get('/getferimage/:image',(req,res)=>{
      let image = req.params.image;
      res.sendFile(`${Dpath}/Ferimages/${image}`);
   })

   app.get("/findtest1/:testname/", function(req, res) {
      let testname= req.params.testname;
      jsonfile.readFile(`${Dpath}/${testname}/`+'quesans1.json',(err,obj)=>{
         console.log("ander aaya get k");
         
         if(!err){
            console.log("no error give quesans");
            res.send(JSON.stringify({
               error:false,
               msg:"Found the file",
               response:obj
            }));
         }
         else
         {
            console.log("yes error give eeror");
            res.send(JSON.stringify({
               error:true,
               msg:err
            }));
         }
      });
   });
   app.get("/findtest3/:testname/", function(req, res) {
      let testname= req.params.testname;
      jsonfile.readFile(`${Dpath}/${testname}/`+'quesans3.json',(err,obj)=>{
         console.log("ander aaya get k");
         
         if(!err){
            console.log("no error give quesans");
            res.send(JSON.stringify({
               error:false,
               msg:"Found the file",
               response:obj
            }));
         }
         else
         {
            console.log("yes error give eeror");
            res.send(JSON.stringify({
               error:true,
               msg:err
            }));
         }
      });
   });

   app.get("/findimages/:testname/", function(req, res) {
      console.log("inside find images");
      let testname= req.params.testname;
      
      var imageDir=`${Dpath}/${testname}/Images2/`;
      getImages(imageDir, function (err, files) {
         if(!err)
         {
         res.send(JSON.stringify({
            error:false,
            msg:"Found the file",
            response:files

         }));
      }
      else
      {
         res.send(JSON.stringify([]));
      }
     });
   });

   app.get("/findferimages/", function(req, res) {
      console.log("inside find images");      
      var imageDir=`${Dpath}/Ferimages/`;
      getImages(imageDir, function (err, files) {
         if(!err)
         {
         res.send(JSON.stringify({
            error:false,
            msg:"Found the file",
            response:files

         }));
      }
      else
      {
         res.send(JSON.stringify([]));
      }
     });
   });


   app.post('/getTests',(req,res)=>{
      fs.readFile(`${Dpath}/tests.json`,(err,obj)=>{
         if(err)
         {
            res.send(JSON.stringify([]));
         }
         else
         {
            obj = JSON.parse(obj);
            res.send(JSON.stringify(obj['tests']));
         }
      })
   });


   app.post('/saveSentimentAnswer',(req,res)=>{
      console.log("ye aay ame",req.body);
      let json=req.body;
      // fs.openSync(`${Dpath}/`+"save2.json",'w');
      fs.readFile(`${Dpath}/save2.json`,(err,obj)=>{
        
         if(err)
         {
            console.log('answer save ni hua',err)
            res.send(JSON.stringify([{error:err}]));
         }
         else
         // console.log(" file is read .......")
         {
            obj = JSON.parse(obj);
            x=obj;
            x['answers'].push((json));
            fs.writeFileSync(`${Dpath}/`+"save2.json", JSON.stringify(x), {spaces:2});
            res.send(JSON.stringify({"error":"it saved"}));
         }
   });
   });
   

   app.post('/getSentimentAnswer',(req,res)=>{
      fs.readFile(`${Dpath}/save2.json`,(err,obj)=>{
         if(err)
         {
            res.send(JSON.stringify([]));
         }
         else
         {
            obj = JSON.parse(obj);
            res.send(JSON.stringify(obj['answers']));
         }

      });    
   });

});

