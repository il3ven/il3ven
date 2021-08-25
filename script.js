const parser = require("fast-xml-parser");
const https = require("https");
const fs = require("fs/promises");

https
  .get("https://il3ven.hashnode.dev/rss.xml", (resp) => {
    let data = "";

    // A chunk of data has been received.
    resp.on("data", (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on("end", async () => {
      const feed = parser.parse(data);

      const articles = feed.rss.channel.item
        .slice(0, 3)
        .map((item) => `1. [${item.title}](${item.link})`);

      console.log(articles);

      const readme = await fs.readFile("./README.md", "utf-8");

      await fs.writeFile(
        "./README.md",
        readme.replace(/(###.*blogs.*)/i, `$1\n\n${articles.join("\n")}`)
      );
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });
