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

db.users.insert({ "_id" : ObjectId("60d8b450474d1c80014e80a5"),
    "firstName" : "System",
    "lastName" : "Administrator",
    "code" : "admin",
    "role" : "Admin",
    "password" : "$2b$10$t/ftiZPdpHFs5s8QCP87j.FD0vVYL6bJjRJ4XUIP9suaGjTZZo8wS",
    "__v" : 0 
})

print('End #################################################################');