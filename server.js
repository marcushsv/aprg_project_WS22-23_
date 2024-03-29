// initialisierung Express

const express = require("express");
const app = express();


app.get("/hello", function(req, res){
    res.send("Fighting Game X is in the making");
});

//initialisierung ejs

app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

// initialisiert Cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//initialisiert session
const session = require('express-session');
app.use(session({
    secret:'example',
    resave:false,
    saveUninitialized: false
}));

//Startet Server
app.listen(3000, function(){
    console.log("Server wird gestartet")
})
// initialisierung passwort hash
const passwordHash = require('password-hash');
const bcrypt = require('bcrypt');
//statt body-parser
app.use(express.urlencoded({extended: true}))

// Ordner freigeben
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/images"));


// sqlite 3 datenbank
const DATABASE = "benutzer_verwaltung_projekt.db";
const db = require("better-sqlite3")(DATABASE);



app.post("/loginformular", function(req, res){
    const param_benutzer = req.body.benutzer; // auch möglich = req["benutzername"]
    const param_password = req.body.password;
    const rows = db.prepare("SELECT Passwort FROM user_verwaltung_projekt WHERE Benutzername=?").all(param_benutzer);
    if (rows && rows.length == 1) {
        const hash = rows[0].Passwort;
        const isValid = bcrypt.compareSync(param_password, hash);
        if (isValid == true) {
            req.session.authenticated = true;
            req.session.user = param_benutzer;
            res.render("game-seite", {"benutzername": param_benutzer} )
            
        }
        else {
            res.render("loginFehlgeschlagen", {"benutzername": param_benutzer})

        }
    } else {
        res.render("loginFehlgeschlagen", {"benutzername": param_benutzer})

    }
    
}); 

//Sessionvariable setzen
// app.post("/sessionSetzen", function(req,res){
//     //wert aus dem Formular lesen
//     const param_sessionValue= req.body.benutzer;
//     //sessionvariable setzen
//     req.session.user= param_sessionValue;
//     //weiterleiten
//     res.redirect("/zeigesession");

// }); 

//Sessionvariable Löschen 
app.get("/abmelden",function(req,res){
    req.session.destroy();

    res.redirect("/startseite");
})

//sessionvariable lesen
// app.get("/zeigesession", function(req,res){
//     if (!req.session.sessionValue){
//         res.render("loginsession", {"message": "Sessionvariable nicht gesetzt"});
//     }
//     else{
//         res.render("loginsession", {"message": req.session.sessionValue});
//     }
// });


// app.get("/loginsession", function(req,res){
//     if (!req.session.user){
//         res.render("loginformular", {"message": "Sessionvariable nicht gesetzt"});
//     }
//     else{
//         res.render("loginformular", {"message": req.session.user});
//     }
// });
// app.post("/hinzufuegen", function(req, res){
//     const benutzer = req.body.benutzer; // auch möglich = req["benutzername"]
//     const password = req.body.password;

//     const info = db.prepare("INSERT INTO user(Benutzername, Passwort) VALUES(?, ?)").run(benutzer, password);
//     console.log(info);

//     res.redirect("/benutzerliste");
    

// }); 




// formulare get requests

app.get("/loginformular", function(req, res){
    res.render("loginformular.ejs");
});

app.get("/game-seite", function(req, res){
    if (!req.session.user){
        res.render("loginformular", {"message": "Sessionvariable nicht gesetzt"});
    }
    else{
        res.render("game-seite.ejs");
    }


    
});
app.get("/index-parry", function(req, res){
    if (!req.session.user){
        res.render("loginformular", {"message": "Sessionvariable nicht gesetzt"});
    }
    else{
        res.sendFile(__dirname + "/views/index-parry.html");
    }
    
});
app.get("/team", function(req, res){
    res.render("team.ejs");
});

app.get("/registrierung", function(req, res){
    res.render("registrierung.ejs");
});

app.get("/registrierung-test", function(req, res){
    res.render("registrierung-test.ejs");
});
app.get("/loginformular-test", function(req, res){
    res.render("loginformular-test.ejs");
});


app.get("/startseite", function(req,res) {
    res.render("startseite.ejs");
    
});


app.post("/hinzufuegen", function(req, res){
    const param_benutzer = req.body.benutzer; // auch möglich = req["benutzername"]
    const param_password = req.body.password;
    rows = db.prepare("SELECT * FROM user_verwaltung_projekt WHERE Benutzername = ?").all(param_benutzer);
    if (rows.length == 0){
        const hash = bcrypt.hashSync(param_password, 10)
        const info = db.prepare("INSERT INTO user_verwaltung_projekt(Benutzername, Passwort) VALUES(?, ?)").run(param_benutzer, hash);
        console.log(info);
        res.render("startseite", {"Benutzername": param_benutzer} )
    }
    else {
        res.render('startseite', { 'message': `Fehler: Benutzername ${param_benutzer} existiert bereits!` });
    }

}); 
// eigene Funktionen
function anmeldungErfolgreich (benutzer, password){  
    const rows = db.prepare('SELECT * FROM user_verwaltung_projekt').all();
    for (element of rows){
        if (element.Benutzername == benutzer && element.Passwort == password){
            return true;
            };
    };
        return false;
};
