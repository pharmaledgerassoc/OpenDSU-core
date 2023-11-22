const {createCommandObject} = require("./lib/createCommandObject");
const commandNames = require("./lib/commandsNames");

function CloudEnclaveClient(clientDID, remoteDID, requestTimeout) {
    let initialised = false;
    const DEFAULT_TIMEOUT = 30000;

    this.commandsMap = new Map();
    this.requestTimeout = requestTimeout ?? DEFAULT_TIMEOUT;

    const ProxyMixin = require("./ProxyMixin");
    ProxyMixin(this);

    const init = async () => {
        try {
            const w3cDID = require("opendsu").loadAPI("w3cdid");
            this.clientDIDDocument = await $$.promisify(w3cDID.resolveDID)(clientDID);
            this.remoteDIDDocument = await $$.promisify(w3cDID.resolveDID)(remoteDID);
        } catch (err) {
            console.log(err);
        }
        this.initialised = true;
        this.finishInitialisation();
        this.dispatchEvent("initialised");
        subscribe();
    }

    this.isInitialised = () => {
        return initialised;
    }

    this.getDID = (callback) => {
        callback(undefined, did);
    }

    this.grantReadAccess = (forDID, resource, callback) => {
        this.__putCommandObject(commandNames.GRANT_READ_ACCESS, forDID, resource, callback);
    }

    this.grantWriteAccess = (forDID, resource, callback) => {
        this.__putCommandObject(commandNames.GRANT_WRITE_ACCESS, forDID, resource, callback);
    }

    this.grantAdminAccess = (forDID, resource, callback) => {
        this.__putCommandObject(commandNames.GRANT_ADMIN_ACCESS, forDID, resource, callback);
    }

    this.callLambda = (lambdaName, ...args) => {
        if (typeof args[args.length - 1] !== "function") {
            throw new Error("Last argument must be a callback function");
        }
        this.__putCommandObject(lambdaName, ...args);
    }

    this.__putCommandObject = (commandName, ...args) => {
        const callback = args.pop();
        args.push(clientDID);

        const command = JSON.stringify(createCommandObject(commandName, ...args));
        const commandID = JSON.parse(command).commandID;
        this.commandsMap.set(commandID, {"callback": callback, "time": Date.now()});

        this.clientDIDDocument.sendMessage(command, this.remoteDIDDocument, (err, res) => {
            console.log("Sent command with id " + commandID)
            if (err) {
                console.log(err);
            }
        });
    }

    const subscribe = () => {
        this.clientDIDDocument.subscribe((err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            try {
                const resObj = JSON.parse(res);

                const commandResult = resObj.commandResult;
                const commandID = resObj.commandID;

                if (!this.commandsMap.get(commandID)) return;

                const callback = this.commandsMap.get(commandID).callback;
                this.commandsMap.delete(commandID)
                console.log("Deleted resolved command with id " + commandID)
                if(resObj.error){
                    callback(Error(commandResult.debug_message));
                    return;
                }
                callback(err, commandResult);
            } catch (err) {
                console.log(err);
            }
        })
    }
    const bindAutoPendingFunctions = require("../../utils/BindAutoPendingFunctions").bindAutoPendingFunctions;
    bindAutoPendingFunctions(this, ["on", "off", "dispatchEvent", "beginBatch", "isInitialised", "getEnclaveType"]);

    init();
}

module.exports = CloudEnclaveClient;
