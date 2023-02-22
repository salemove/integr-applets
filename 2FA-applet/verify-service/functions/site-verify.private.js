const fetch = require("node-fetch");

exports.verifySiteId = async (context, event) => {
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");
    const base_url = context.GLIA_BASE_URL;

    try {
        if (
            typeof event.siteId === "undefined" ||
            event.siteId === "" ||
            event.siteId === null
        ) {
            response.setStatusCode(400);
            response.setBody({
                success: false,
                error: "Missing parameter siteId",
            });
            return response;
        }
        const authUrl = `${base_url}operator_authentication/tokens`;
        const authOptions = {
            method: "POST",
            headers: {
                Accept: "application/vnd.salemove.v1+json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                api_key_id: context.API_KEY_ID,
                api_key_secret: context.API_KEY_SECRET,
            }),
        };

        const authResponse = await fetch(authUrl, authOptions);
        const authData = await authResponse.json();
        var token;
        if (authResponse && authData) {
            token = authData.token;
        } else {
            response.setStatusCode(403);
            response.setBody({
                success: false,
                error: `Couldn't get Bearer token, api response: "${authResponse}"`,
            });
            return response;
        }

        const siteId = event.siteId;
        const verifyUrl = `${base_url}sites/${siteId}`;
        const verifyOptions = {
            method: "GET",
            headers: {
                Accept: "application/vnd.salemove.v1+json",
                Authorization: `Bearer ${token}`,
            },
        };

        const verifyResponse = await fetch(verifyUrl, verifyOptions);
        const verifyData = await verifyResponse.json();
        if (verifyResponse && verifyData) {
            response.setStatusCode(200);
            response.setBody({ success: true });
            return response;
        } else {
            response.setStatusCode(204);
            response.setBody({
                success: false,
                error: "Found no content for such siteId",
            });
            return response;
        }
    } catch (error) {
        const statusCode = error.status || 400;
        response.setStatusCode(statusCode);
        response.setBody({
            success: false,
            error: error.message,
        });
        return response;
    }
};
