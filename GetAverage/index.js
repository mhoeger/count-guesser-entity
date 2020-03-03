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
    const { entityState } = await client.readEntityState(entityId);
    
    // Calculate average of estimates
    const count = entityState ? entityState[0] : 0;
    const total = entityState ? entityState[1] : 0;
    const average = total / count;
    return {
        body: `Average estimate from ${count} submissions is: ${average}.`
    }
};

