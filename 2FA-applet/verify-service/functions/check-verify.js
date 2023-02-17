exports.handler = async function (context, event, callback) {
    const response = new Twilio.Response();
    response.appendHeader(
        "Access-Control-Allow-Origin",
        "https://app.glia.com"
    );
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");

    const verifySiteIdPath = Runtime.getFunctions()["site-verify"].path;
    const verifyHelper = require(verifySiteIdPath);
    const result = await verifyHelper.verifySiteId(context, {
        siteId: event.siteId,
    });
    if (result.statusCode != 200) {
        return callback(null, result);
    }

    try {
        if (
            typeof event.to === "undefined" ||
            typeof event.code === "undefined"
        ) {
            throw new Error("Missing parameter.");
        }

        const client = context.getTwilioClient();
        const service = context.VERIFY_SERVICE_SID;
        const { to, code } = event;

        const check = await client.verify
            .services(service)
            .verificationChecks.create({ to, code });

        if (check.status === "approved") {
            response.setStatusCode(200);
            response.setBody({
                success: true,
                message: "Verification success.",
            });
            return callback(null, response);
            // eslint-disable-next-line no-else-return
        } else {
            throw new Error("Incorrect token.");
        }
    } catch (error) {
        console.error(error.message);
        response.setBody({
            success: false,
            message: error.message,
        });
        return callback(null, response);
    }
};
