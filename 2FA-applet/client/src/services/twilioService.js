import API from "./api";
import API_ROUTES from "./api-routes";

const twilioService = {
    async startVerify(toPhoneNumber, siteId) {
        const response = await API.post(
            API_ROUTES.start_verify,
            {
                to: toPhoneNumber,
                siteId
            }
        );

        return response.data;
    },

    async checkVerify(toPhoneNumber, verifyCode, siteId) {
        const response = await API.post(
            API_ROUTES.check_verify,
            {
                to: toPhoneNumber,
                code: verifyCode,
                siteId
            }
        );

        return response.data;
    },

    async cancelVerify(toPhoneNumber, siteId) {
        const response = await API.post(
            API_ROUTES.cancel_verify,
            { to: toPhoneNumber, siteId }
        );

        return response.data;
    },
};

export default twilioService;
