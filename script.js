const parser = require("fast-xml-parser");
const https = require("https");
const fs = require("fs").promises;
const path = require("path");

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

      const readme = await fs.readFile(
        path.join(__dirname, "./README.md"),
        "utf-8"
      );

      await fs.writeFile(
        path.join(__dirname, "./README.md"),
        readme.replace(
          /(### My last 3 blogs)(.*)(_Updated using GitHub Actions_ )/is,
          `$1\n\n${articles.join("\n")}\n\n$3`
        )
      );
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });
