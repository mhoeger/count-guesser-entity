const df = require("durable-functions")

// https://marblecounterentity.azurewebsites.net/api/AddEstimate?guess=10&entityId=12345
module.exports = async function (context, req) {
    const client = df.getClient(context);
    // Reset total counter
    let entityId = new df.EntityId("TotalCounter", "marbles");
    await client.signalEntity(entityId, "reset");
    // Reset winner counter
    entityId = new df.EntityId("winnercounter", "marbles");
    await client.signalEntity(entityId, "reset");
    const { entityState } = await client.readEntityState(entityId);
    return {
        body: `Current value: ${entityState}`,
        status: 200
    }
};
