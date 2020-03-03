/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 * 
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your 
 *    function app in Kudu
 */

const df = require("durable-functions")

module.exports = df.entity(function(context) {
    const currentValue = context.df.getState(() => [0, 0]);
    switch (context.df.operationName) {
        case "add":
            const previousCount = currentValue[0];
            const previousTotal = currentValue[1];
            // Check if input is a valid number
            let newValue = context.df.getInput();
            if (typeof newValue === "string") {
                newValue = parseFloat(newValue);
            }
            if (typeof newValue === "number") {
                // Guess must be a positive value
                if (newValue > 0) {
                    context.df.setState([previousCount + 1, previousTotal + newValue]);
                    // If exact match *hard-coded for now*, signal win condition
                    if (newValue == 410) {
                        context.log("found winner!!");
                        const entityId = new df.EntityId("winnercounter", "marbles");
                        context.df.signalEntity(entityId, "add");
                    }
                }
            // Warn a bad value but do not fail
            } else {
                context.log.warn(`Bad input type '${typeof newValue}': ${JSON.stringify(newValue)}`); 
            }
            break;
        case "reset":
            context.df.setState([0, 0]);
    }
});