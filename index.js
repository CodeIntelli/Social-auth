import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import { SocialRoutes } from "./src/routes";
import "./src/database/index.js";
import { PORT } from "./src/config/";


app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
    })
);
import bodyParser from "body-parser";

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", SocialRoutes);

// ? when we declare any undefine variable then this error occur so we can handle this error here
process.on("uncaughtException", (error) => {
    console.error(
        `Shutting down the server due to uncaught exception:${error.message}`
    );
    process.exit(1);
});

let server = app.listen(PORT, () => {
    console.log("\n\n\n\n\n");
    console.log(`Server Connected at http://localhost:${PORT}`);
});

// * unhandled promise rejection: it occur when we are put incorrect mongodb string in short it accept all mongodb connection errors
//  * when we are handling this error we dont need to put catch block in database connection file
process.on("unhandledRejection", (error) => {
    console.error(
        `Shutting down the server due to unhandled promise rejection: ${error.message}`
    );
    server.close(() => {
        process.exit(1);
    });
});
