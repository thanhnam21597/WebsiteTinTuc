var http = require('http');
var url = require('url');
var fs = require('fs');
var AWS = require('aws-sdk');
var express= require('express');
var bodyParser = require('body-parser');
var app =express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine','ejs');
app.use(express.static(__dirname + "/CNM"));
app.use('/css',express.static('css'));
app.use('/js',express.static('js'));
app.use('/sass',express.static('sass'));
app.use('/fonts',express.static('fonts'));
app.use('/images',express.static('images'));
const port = process.env.PORT||3000
AWS.config.update({
    region: "us-east-2",
    endpoint: "http://dynamodb.us-east-2.amazonaws.com"
});
AWS.config.accessKeyId="AKIAJQ7IV7DWDIW65CAQ";
AWS.config.secretAccessKey="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";
var docClient = new AWS.DynamoDB.DocumentClient();
app.get('/admin',function(req,res){
    var param = {
        TableName: "News",
        ProjectionExpression:"#a,#p,content,shortdescription,categories,authors",
        ExpressionAttributeNames:{
            "#a":"articletitle",
            "#p":"postdate"
        }
    };
    docClient.scan(param,function (err,data) {
        if (err) {
            console.log("error = ", JSON.stringify(err, null, 2));
        } else {
            console.log("success = ", JSON.stringify(data, null, 2));
           // res.sendFile(__dirname+'/admin.html',{data:data});
            res.render('admin',{data:data});
        }
    })
});
app.post('/addnew',urlencodedParser,function(req,res){
    console.log(req.body);
    var input={
        "articletitle":req.body.ArticleTitle,
        "postdate":req.body.PostDate,
        "content":req.body.Content,
        "shortdescription":req.body.ShortDescription,
        "categories":req.body.Categories,
        "authors":req.body.Authors
    };
    var param = {
        TableName: "News",
        Item:input
    };
    docClient.put(param,function(err,data){
        if (err){
            console.log("Error: "+JSON.stringify(err,null,2));
        }else{
            console.log("Success");
        }
    });
    res.redirect('admin');
});
app.post('/editnew',urlencodedParser,function(req,res){
    var param = {
        TableName: "News",
        Key:{
            "articletitle":req.body.ArticleTitle,
            "postdate":req.body.PostDate
        },
        UpdateExpression:"set content = :bycontent, shortdescription=:byshortdescription,categories=:bycategories,authors=:byauthors",
        ExpressionAttributeValues:{
            ":bycontent"  :req.body.Content,
            ":byshortdescription":req.body.ShortDescription,
            ":bycategories":req.body.Categories,
            ":byauthors":req.body.Authors
        },
        ReturnValues:"UPDATED_NEW"
    };
    docClient.update(param,function(err,data){
        if (err){
            console.log("Error: "+JSON.stringify(err,null,2));
        }else{
            console.log("Success");
        }
    });
    res.redirect('admin');
});
app.post('/deletenew',urlencodedParser,function(req,res){
    var param = {
        TableName: "News",
        Key:{
            "articletitle":req.body.ArticleTitle,
            "postdate":req.body.PostDate
        }
    };
    docClient.delete(param,function(err,data){
        if (err){
            console.log("Error: "+JSON.stringify(err,null,2));
        }else{
            console.log("Success");
        }
    });
    res.redirect('admin');
});
app.get('/',function(req,res){
    var param = {
        TableName: "News",
        ProjectionExpression:"#a,#p,content,shortdescription,categories,authors",
        ExpressionAttributeNames:{
            "#a":"articletitle",
            "#p":"postdate"
        }
    };
    docClient.scan(param,function (err,data) {
        if (err) {
            console.log("error = ", JSON.stringify(err, null, 2));
        } else {
            console.log("success = ", JSON.stringify(data, null, 2));
            // res.sendFile(__dirname+'/admin.html',{data:data});
            res.render('index',{data:data});
        }
    })
});
app.get('/style',function(req,res){
    var param = {
        TableName: "News",
        ProjectionExpression:"articletitle,postdate,content,shortdescription,categories,authors",
        FilterExpression:"categories=:ca",
        ExpressionAttributeValues:{
            ":ca":"Style"
        }
    };
    docClient.scan(param,function (err,data) {
        if (err) {
            console.log("error = ", JSON.stringify(err, null, 2));
        } else {
            console.log("success = ", JSON.stringify(data, null, 2));
            // res.sendFile(__dirname+'/admin.html',{data:data});
            res.render('style',{data:data});
        }
    })
});
app.get('/detail/:arti/:pd',function(req,res){
    var param = {
        TableName: "News",
        Key:{
            "articletitle":req.params.arti,
            "postdate":req.params.pd

        }
    };
    docClient.get(param,function (err,data) {
        if (err) {
            console.log("error = ", JSON.stringify(err, null, 2));
        } else {
            console.log("success = ", JSON.stringify(data, null, 2));
            res.sendFile(__dirname+'/admin.html',{data:data});
            res.render('single',{data:data});
        }
    })
});
app.get('/fashion',function(req,res){
    var param = {
        TableName: "News",
        ProjectionExpression:"articletitle,postdate,content,shortdescription,categories,authors",
        FilterExpression:"categories=:ca",
        ExpressionAttributeValues:{
            ":ca":"Fashion"
        }
    };
    docClient.scan(param,function (err,data) {
        if (err) {
            console.log("error = ", JSON.stringify(err, null, 2));
        } else {
            console.log("success = ", JSON.stringify(data, null, 2));
            // res.sendFile(__dirname+'/admin.html',{data:data});
            res.render('fashion',{data:data});
        }
    })
});
app.get('/travel',function(req,res){
    var param = {
        TableName: "News",
        ProjectionExpression:"articletitle,postdate,content,shortdescription,categories,authors",
        FilterExpression:"categories=:ca",
        ExpressionAttributeValues:{
            ":ca":"Travel"
        }
    };
    docClient.scan(param,function (err,data) {
        if (err) {
            console.log("error = ", JSON.stringify(err, null, 2));
        } else {
            console.log("success = ", JSON.stringify(data, null, 2));
            // res.sendFile(__dirname+'/admin.html',{data:data});
            res.render('travel',{data:data});
        }
    })
});
app.get('/sports',function(req,res){
    var param = {
        TableName: "News",
        ProjectionExpression:"articletitle,postdate,content,shortdescription,categories,authors",
        FilterExpression:"categories=:ca",
        ExpressionAttributeValues:{
            ":ca":"Sports"
        }
    };
    docClient.scan(param,function (err,data) {
        if (err) {
            console.log("error = ", JSON.stringify(err, null, 2));
        } else {
            console.log("success = ", JSON.stringify(data, null, 2));
            // res.sendFile(__dirname+'/admin.html',{data:data});
            res.render('sports',{data:data});
        }
    })
});
app.get('/archives',function(req,res){
    var param = {
        TableName: "News",
        ProjectionExpression:"articletitle,postdate,content,shortdescription,categories,authors",
        FilterExpression:"categories=:ca",
        ExpressionAttributeValues:{
            ":ca":"Archives"
        }
    };
    docClient.scan(param,function (err,data) {
        if (err) {
            console.log("error = ", JSON.stringify(err, null, 2));
        } else {
            console.log("success = ", JSON.stringify(data, null, 2));
            // res.sendFile(__dirname+'/admin.html',{data:data});
            res.render('archives',{data:data});
        }
    })
});
app.listen(port)


