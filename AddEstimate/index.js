const df = require("durable-functions")

module.exports = async function (context, req) {
    // Parse query params
    // Example: https://marblecounterentity.azurewebsites.net/api/AddEstimate?guess=10&entityId=12345
    const estimate = context.req.query.estimate;
    context.log(`Estimate is: ${estimate}`);
    // Get reference to entity
    const client = df.getClient(context);
    const entityId = new df.EntityId("TotalCounter", "marbles");
    // Wait until entity has processed command
    await client.signalEntity(entityId, "add", estimate);
    return {
        body: `Thanks for your submission!`
    }
};

