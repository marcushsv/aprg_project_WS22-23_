/*
Intitialisiert die Datenbank
> .read initialize_user_projekt.sql
*/

CREATE TABLE "user_verwaltung_projekt" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"Benutzername"	TEXT NOT NULL UNIQUE,
	"Passwort"	TEXT NOT NULL,
	PRIMARY KEY("ID" AUTOINCREMENT)
)