require("../../../../psknode/bundles/testsRuntime");
const tir = require("../../../../psknode/tests/util/tir");

const dc = require("double-check");
const assert = dc.assert;
const openDSU = require('../../index');
$$.__registerModule("opendsu", openDSU);
const enclaveAPI = openDSU.loadAPI("enclave");
const scAPI = openDSU.loadAPI("sc");
const w3cDID = openDSU.loadAPI("w3cdid");

function sleep(timeoutMs) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeoutMs);
    });
}

assert.callback('MqProxy test', (testFinished) => {
    dc.createTestFolder('createDSU', async (err, folder) => {
        const vaultDomainConfig = {
            "anchoring": {
                "type": "FS",
                "option": {}
            },
            "enable": ["enclave", "mq"]
        }

        await tir.launchConfigurableApiHubTestNodeAsync({ domains: [{ name: "default", config: vaultDomainConfig }] });
        const sc = scAPI.getSecurityContext();

        sc.on("initialised", async () => {
            try {
                const domain = "default";
                const clientDIDDocument = await $$.promisify(w3cDID.createIdentity)("ssi:name", domain, "client");
                const remoteDIDDocument = await $$.promisify(w3cDID.createIdentity)("ssi:name", domain, "remote");

                const remoteEnclave = enclaveAPI.initialiseRemoteEnclave(clientDIDDocument.getIdentifier(), remoteDIDDocument.getIdentifier());
                const TABLE = "test_table";
                const addedRecord = { data: 1 };
                remoteEnclave.on("initialised", async () => {
                    try {

                        console.log("@@AIIIIICI");

                        await $$.promisify(remoteEnclave.insertRecord)("some_did", TABLE, "pk1", addedRecord, addedRecord);
                       
                        setTimeout(async () => {
                            console.log("GET Message");
                            const record = await $$.promisify(mqProxy.getRecord)("some_did", TABLE, "pk1");
                            console.log("@@Record!", record);
                            testFinished();
                        }, 1000)


                    } catch (e) {
                        return console.log(e);
                    }
                    
                });

            } catch (e) {
                return console.log(e);
            }
        });
    });
}, 2000000);

