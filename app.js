require("dotenv").config();

const express = require("express");
const bodyparser = require("body-parser");
const session = require("express-session");
const memoryStore = require("memorystore")(session);
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const path = require('path'); // Ensure path is imported

const app = express();

const { ConnectDatabase } = require("./database/DatabaseManager.js");

app.use(connectLivereload());

// Create a livereload server to watch static files
const liveReloadServer = livereload.createServer();
liveReloadServer.watch([
    path.join(__dirname), // Watch the root directory
    path.join(__dirname, 'css'),  // Watch the 'css' directory
    path.join(__dirname, 'js'),   // Watch the 'js' directory
    path.join(__dirname, 'assets') // Watch the 'assets' directory, if any
]);

// Notify the browser of changes
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

// Error handler route


// Importing route files
const homeRoute = require("./routes/home.js");
const accountRoute = require("./routes/account.js");
const errorRoute = require("./routes/error.js");
// const authRoute = require("./routes/auth.js");
// const petitionRoute = require("./routes/petition.js");
// const categoryRoute = require("./routes/category.js");

app.use(bodyparser.urlencoded({ extended: true }));  // Corrected the extended type

// Session configuration
app.use(
    session({
        secret: "Catalyst",
        cookie: {
            secure: false,
            maxAge: 86400000, // 24 hours
        },
        store: new memoryStore({
            checkPeriod: 86400000, // Clean up expired sessions every 24 hours
        }),
        saveUninitialized: false,
        resave: false,
    })
);

// Serve static files from root or a public folder
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'json')));
app.use(express.static(path.join(__dirname, 'javascript')));
app.use(express.static(path.join(__dirname, 'images')));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Establish MongoDB connection
ConnectDatabase();

// Use routes
app.use("/", homeRoute);
app.use("/account", accountRoute);
app.use("/error", errorRoute);
// Uncomment routes when needed
// app.use("/user", userRoute);
// app.use("/auth", authRoute); 
// app.use("/category",categoryRoute);
// app.use("/petition",petitionRoute);

// Start the server
app.listen(process.env.DEVELOPMENT_PORT || process.env.PORT, () => {
    console.log(`PORT: ${process.env.DEVELOPMENT_PORT} | ACTIVE`);
});
