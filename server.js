const express=require("express");
const app=express();
const mongoose=require("mongoose");
const shortUrl=require('./models/shorturl');

app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}))

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0').
then(()=> console.log('Database Connected Successfully')).
catch((err)=> console.log(err));

app.get('/',async(req,res)=>{
    const shortUrls=await shortUrl.find();
    res.render('index',{shortUrls:shortUrls});
});

app.post('/shorturl',async(req,res)=>{
    await shortUrl.create({full:req.body.fullurl});
    res.redirect('/');
});
app.get('/:shorturl',async(req,res)=>{
    const shortURL=await shortUrl.findOne({short:req.params.shorturl})
    if(!shortURL){
        return res.sendStatus(404);
    }
    shortURL.clicks++;
    shortURL.save();
    res.redirect(shortURL.full)
})
app.listen(process.env.PORT || 3000);