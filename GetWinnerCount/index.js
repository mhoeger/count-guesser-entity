const df = require("durable-functions")

module.exports = async function (context, req) {
    // Get reference to entity
    const client = df.getClient(context);
    const entityId = new df.EntityId("winnercounter", "marbles");
    // Wait until entity has processed command
    const { entityState } = await client.readEntityState(entityId);

    return {
        body: `Number of winners is ${entityState || 0}!`
    }
};

