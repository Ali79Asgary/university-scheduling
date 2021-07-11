print('Start #################################################################');

db = db.getSiblingDB('uni');
db.createUser(
  {
    user: 'mongodb_user1234',
    pwd: '34ct873b7y4394rmy43',
    roles: [{ role: 'readWrite', db: 'uni' }],
  },
);
db.createCollection('users');
db.createCollection('admins');
db.createCollection('masters');
db.createCollection('students');

db.users.insertMany(
  [
    {
          "_id" : ObjectId("60d8b450474d1c80014e80a5"),
          "firstName" : "System",
          "lastName" : "Administrator",
          "code" : "admin",
          "password" : "$2b$10$t/ftiZPdpHFs5s8QCP87j.FD0vVYL6bJjRJ4XUIP9suaGjTZZo8wS",
          "__v" : 0,
          "role" : "Admin"
    },
    {
          "_id" : ObjectId("60e90996637e7b6008827fcf"),
          "firstName" : "Master",
          "lastName" : "Master",
          "code" : "master001",
          "password" : "$2b$10$rORQtC2QJ7zQH2hdGy/rVeYcQys1ppPiA38O6RxJMGgA3LzHkxnzm",
          "__v" : 0,
          "role" : "Master"
    },
    {
          "_id" : ObjectId("60e90a22637e7b6008827fd5"),
          "firstName" : "Master2",
          "lastName" : "Master2",
          "code" : "master003",
          "password" : "$2b$10$WQX..OphhZwxMzpf3m7xaODf7i.R8PH9FVvSXFqbkXxgKwAqwVkVO",
          "__v" : 0,
          "role" : "Master"
    },
    {
          "_id" : ObjectId("60e90a22637e7b6008827fda"),
          "firstName" : "Student1",
          "lastName" : "Student1",
          "code" : "stuent001",
          "password" : "$2b$10$4QQvF/9J6d7FjsN3jcz7MulOm/cC2hCxF0GduMu.hjwZcN9ClnOLa",
          "__v" : 0,
          "role" : "Student"
    },
    {
          "_id" : ObjectId("60ea4d221abec8cc3fe35c7f"),
          "firstName" : "Test",
          "lastName" : "Admin",
          "code" : "979701",
          "role" : "Admin",
          "password" : "$2b$10$KoXFtKkEshtQ7yxW9mAhKOCrIHfV1NnBMOkarKsv0N9h3KjpX.jZC",
          "__v" : 0
    },
    {
          "_id" : ObjectId("60ea4d231abec8cc3fe35c84"),
          "firstName" : "Test",
          "lastName" : "Master",
          "code" : "969601",
          "role" : "Master",
          "password" : "$2b$10$v294pRnsN3H3Gz3mTyK39eovRMvOU6Baek9JyTVJx5X6fYQ2wZdh.",
          "__v" : 0
    },
    {
          "_id" : ObjectId("60ea4d231abec8cc3fe35c89"),
          "firstName" : "Test",
          "lastName" : "Student",
          "code" : "989801",
          "role" : "Student",
          "password" : "$2b$10$UPy21POv1jSnAGbV5SK73.FULhyyHIVIgwsZSDbUfyQHg3gQgSUwK",
          "__v" : 0
    },
    {
          "_id" : ObjectId("60ea4f1f1abec8cc3fe35c8e"),
          "firstName" : "مسعود",
          "lastName" : "پورغفار اقدم",
          "code" : "975361004",
          "role" : "Admin",
          "password" : "$2b$10$BBD85yA74Di8zASZvtvkC.hNgUQ2kaR8DwOnAmL8gB4R4KMbaao4y",
          "__v" : 0
    },
    {
          "_id" : ObjectId("60ea4f1f1abec8cc3fe35c93"),
          "firstName" : "ریحانه",
          "lastName" : "زهرابی",
          "code" : "965361004",
          "role" : "Master",
          "password" : "$2b$10$vzpzxRwN0PY1LE/sI9eqjOqfKaz8dB2cog4J/ZGhJuCGv9.HhwKaG",
          "__v" : 0
    },
    {
          "_id" : ObjectId("60ea4f1f1abec8cc3fe35c98"),
          "firstName" : "نرگس",
          "lastName" : "میرزایی",
          "code" : "985361004",
          "role" : "Student",
          "password" : "$2b$10$9CSPSVjHZTOiusLgGI98c.yBdJaTpbj.deEAVgz.sG54uHAf2dMiO",
          "__v" : 0
    },
    {
          "_id" : ObjectId("60ea4f1f1abec8cc3fe35c9d"),
          "firstName" : "طاها",
          "lastName" : "علیپور",
          "code" : "985361003",
          "role" : "Student",
          "password" : "$2b$10$oMRNniuTL18wJUPlRfQexOlnnAZO27n1pVLlyXQ9PoTN0xxVlqyeu",
          "__v" : 0
    },
  ]
)

db.admins.insertMany(
  [
    { "_id" : ObjectId("60ea4d221abec8cc3fe35c81"), "user" : ObjectId("60ea4d221abec8cc3fe35c7f"), "__v" : 0 },
    { "_id" : ObjectId("60ea4f1f1abec8cc3fe35c90"), "user" : ObjectId("60ea4f1f1abec8cc3fe35c8e"), "__v" : 0 }
  ]
)
db.masters.insertMany(
  [
    { "_id" : ObjectId("60e90996637e7b6008827fd1"), "timeTables" : [ ], "timeTableBells" : [ ], "courses" : [ ], "user" : ObjectId("60e90996637e7b6008827fcf"), "__v" : 0 },
    { "_id" : ObjectId("60e90a22637e7b6008827fd7"), "timeTables" : [ ], "timeTableBells" : [ ], "courses" : [ ], "user" : ObjectId("60e90a22637e7b6008827fd5"), "__v" : 0 },
    { "_id" : ObjectId("60ea4d231abec8cc3fe35c86"), "timeTables" : [ ], "timeTableBells" : [ ], "courses" : [ ], "user" : ObjectId("60ea4d231abec8cc3fe35c84"), "__v" : 0 },
    { "_id" : ObjectId("60ea4f1f1abec8cc3fe35c95"), "timeTables" : [ ], "timeTableBells" : [ ], "courses" : [ ], "user" : ObjectId("60ea4f1f1abec8cc3fe35c93"), "__v" : 0 }
  ]
)
db.students.insertMany(
  [
    { "_id" : ObjectId("60e90a22637e7b6008827fdc"), "timeTables" : [ ], "user" : ObjectId("60e90a22637e7b6008827fda"), "__v" : 0 },
    { "_id" : ObjectId("60ea4d231abec8cc3fe35c8b"), "timeTables" : [ ], "user" : ObjectId("60ea4d231abec8cc3fe35c89"), "__v" : 0 },
    { "_id" : ObjectId("60ea4f1f1abec8cc3fe35c9a"), "timeTables" : [ ], "user" : ObjectId("60ea4f1f1abec8cc3fe35c98"), "__v" : 0 },
    { "_id" : ObjectId("60ea4f1f1abec8cc3fe35c9f"), "timeTables" : [ ], "user" : ObjectId("60ea4f1f1abec8cc3fe35c9d"), "__v" : 0 }
  ]
)

print('End #################################################################');