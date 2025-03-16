Setting up:
To set up both front and back end do this
```
cd frontend
npm install

cd backend
npm install
```

To run localhost use:
```
For frontend:
cd frontend
npm run dev

For backend:
cd backend
npm start
```
*Directions assume you are at the root directory*


You should have a .env file to store your database credentials, below are the credentials for the used database:
DB_HOST=sql12.freesqldatabase.com\n
DB_USER=sql12766530
DB_PASSWORD=SE6DjZ3cMy
DB_NAME=sql12766530
DB_PORT=3306
PORT=5000

Unfortunately the database is free and it may be expired by the time you'll use it.
To be able to use access the application and its features you can change the credentials to:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=porkybest
DB_PORT=3306
PORT=5000

Also download xampp if you try to use local
