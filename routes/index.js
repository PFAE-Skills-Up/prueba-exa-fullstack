module.exports = {
getHomePage: (req, res) => {
    let query = "Select * FROM `players` ORDER BY id ASC";

    db.query(query, (err,result) =>{
        if (err){
            res.redirect('/');
        }
        res.render('index.ejs',{
            title:"Welcome to Socka| View Players"
            ,players: result
        });
    });
},

};