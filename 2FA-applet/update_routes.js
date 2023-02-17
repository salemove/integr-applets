const fs = require("fs");

fs.readFile("./output.txt", "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const domain_str = data.match(/check-verify([\s\S]*?)check-verify/gi);
    const base_url = domain_str[0].split("check-verify")[1].trim().slice(0, -1);
    fs.readFile("./client/src/services/api.js", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const result = data.match(/API_LINK = ([\s\S]*?);/gi);
        data = data.replace(result[0], `API_LINK = "${base_url}";`);

        fs.writeFile(
            "./client/src/services/api.js",
            data,
            "utf-8",
            function (err) {
                if (err) throw err;
                console.log("Domain name updated");
            }
        );
    });
});
