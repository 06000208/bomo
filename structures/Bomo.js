const Room = require("./Room");
const log = require("../util/log");
const EventEmitter = require("events");
const path = require("path");
const chalk = require("chalk");
const ejs = require("ejs");
const Keyv = require("keyv");
const sirv = require("sirv");
const { App } = require("@tinyhttp/app");
const { Server: WebSocketServer } = require("ws");

const loggingColors = {
    "1": chalk.gray, // Informational responses
    "2": chalk.cyan, // Successful responses
    "3": chalk.gray, // Redirects
    "4": chalk.yellow, // Client errors
    "5": chalk.magenta, // Server errors
};

/**
 * Bomo's core class. Named Bomo rather than app to differentiate from tinyhttp's App
 * @extends {EventEmitter}
 */
class Bomo extends EventEmitter {
    /**
     * Setting engine, logging middleware, 404 route, and serving the public folder are handled by Bomo's constructor
     */
    constructor() {
        super();

        /**
         * Path of the publicly served folder. Used with sirv.
         */
        this.public = path.join(__dirname, "../public");

        /**
         * Currently available rooms mapped to their ids
         * @type {Map<string, Room>}
         */
        this.rooms = new Map();

        // Inform user of whether keyv will be using database or memory
        if (!process.env.db) log.info("No database present, using memory. Data will not be persisted");

        /**
         * Keyv Database
         * @see https://www.npmjs.com/package/keyv#usage
         * @type {Keyv}
         */
        this.db = process.env.db ? new Keyv(process.env.db) : new Keyv();
        this.db.on("error", err => {
            // Don't allow connection errors with database while starting
            log.fatal("Keyv Connection Error", err);
            return process.exit(1);
        });

        // Check if the port environment variable is valid
        if (!process.env.port) throw new TypeError("PORT environment variable must be a valid number");

        /**
         * Tinyhttp App w/ ejs templating engine
         * @see https://tinyhttp.v1rtl.site/docs#application
         * @see https://ejs.co/#docs
         * @type {App}
         */
        this.app = new App({
            noMatchHandler: (req, res) => {
                res.status(404);
                // respond with html page
                if (req.accepts("html")) {
                    res.render("404.ejs", {
                        title: `${process.env.title} - 404`,
                        icon: "/error.ico",
                        url: req.url,
                    });
                    return;
                }
                // respond with json
                if (req.accepts("json")) {
                    res.json({
                        "code": 404,
                        "error": "404 Not Found",
                        "message": `The requested resource "${req.url}" was not found`,
                    });
                    return;
                }
                // default to plain text
                res.type("txt").send("404 Not Found");
            },
            onError: (err, req, res) => {
                res.status(500).send({
                    message: err.message,
                });
            },
        });

        // Engine
        this.app.engine("ejs", ejs.renderFile);

        // Logging middleware via ./util/log
        this.app.use((request, response, next) => {
            response.on("finish", () => {
                const code = response.statusCode.toString();
                const args = [request.ip || request.socket.remoteAddress, request.method, loggingColors[code[0]](code), response.statusMessage, request.originalUrl || request.url];
                const message = args.join(" ").trim();
                if (code[0] === "4" || code[0] === "5") {
                    log.debug(message);
                } else {
                    log.trace(message);
                }
            });
            next();
        });

        // Static webserver using sirv serving the public folder
        // https://www.npmjs.com/package/sirv
        this.app.use("/", sirv(this.public, {
            dev: process.env.dev === "true",
            maxAge: 86400, // Cached for 24 hours
        }));

        /**
         * The http.Server returned by tinyhttp's App.listen()
         *
         * This will be null until Bomo.start() is called
         * @see https://github.com/tinyhttp/tinyhttp/blob/a9e00dcaa93f2e38f7a68e3301f7cd97dea69270/packages/app/src/app.ts#L354
         * @see https://nodejs.org/api/http.html#http_http_createserver_options_requestlistener
         * @type {?http.Server}
         */
        this.server = null;

        /**
         * Websocket server using ws
         *
         * Notes:
         *
         * - This is an implementation of a real websocket library, so the preferred equivalent client side is the browser's own WebSocket implementation
         * - I couldn't find documentation for CommonJS usage of ws, but destructuring Server as WebSocketServer works fine
         * - This will be null until created by Bomo.start() in order to use the same internal http server as tinyhttp
         * @see https://github.com/websockets/ws/blob/HEAD/doc/ws.md
         * @see https://www.npmjs.com/package/ws
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
         * @type {?WebSocketServer}
         */
        this.wss = null;
    }

    /**
     * Starts bomo
     */
    start() {
        // Create http server & make tinyhttp listen
        this.server = this.app.listen(Number(process.env.port), () => {
            // callback after server starts listening
            log.info(`${chalk.green("[READY]")} tinyhttp listening on port ${process.env.port}`);
        });

        // Create websocket server using pre-existing http server
        this.wss = new WebSocketServer({
            clientTracking: true,
            path: "/ws",
            server: this.server,
        });

        // Add websocket server events
        this.wss.on("connection", (ws) => {
            ws.on("message", (message) => {
                /*
                we should anticipate all messages (encryption/https aside) will be in json formatting as the following;
                { "type": "some_type_thing", data": {} // anything }
                */
                // let data;
                // try {
                //     data = JSON.parse(message);
                // } catch (e) {
                //     // should probably do something if we get garbage but rn i've got nothin so bad programming practices ahoy
                //     return;
                // }
                // switch (data.type) {
                //     case "update_state":
                //         break;
                //     case "message_create":
                //         break;
                //     default:
                //         break; // ¯\_(ツ)_/¯ :yea:
                // }
            });
        });
        log.info(`${chalk.green("[READY]")} Websocket server ready to upgrade connections`);
    }

    /**
     * Stops bomo
     * @todo Reading the ws documentation, it doesn't look like this could easily await wss.close()
     */
    stop() {
        // this.wss.close();
        process.exit(0);
    }

    // /**
    //  * Creates a room
    //  * @returns {Room} - Returns the room created
    //  */
    // createRoom() {
    //     return new Room(this);
    // }
}

module.exports = Bomo;
