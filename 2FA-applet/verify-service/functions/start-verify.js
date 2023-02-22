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
        if (typeof event.to === "undefined" || event.to.trim() === "") {
            throw new Error(
                "Missing 'to' parameter; please provide a phone number."
            );
        }

        const client = context.getTwilioClient();
        const service = context.VERIFY_SERVICE_SID;
        const { to } = event;
        const channel = "sms";
        const locale =
            typeof event.locale === "undefined" ? "en" : event.locale;

        const verification = await client.verify
            .services(service)
            .verifications.create({
                to,
                channel,
                locale,
            });

        console.log(`Sent verification: '${verification.sid}'`);
        response.setStatusCode(200);
        response.setBody({ success: true });
        return callback(null, response);
    } catch (error) {
        const statusCode = error.status || 400;
        response.setStatusCode(statusCode);
        response.setBody({
            success: false,
            error: error.message,
        });
        return callback(null, response);
    }
};
