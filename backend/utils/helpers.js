import fs from "fs";
import csv from "csv-parser";

export const isValidEmail = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
};


export const parseFile = (filePath, extname) => {
    return new Promise((resolve, reject) => {
        if (!filePath || !extname) {
            return reject(new Error("Invalid parameters: filePath and extname are required"));
        }

        if (!fs.existsSync(filePath)) {
            return reject(new Error("File does not exist"));
        }

        if (extname === ".json") {
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) return reject(err);
                try {
                    const jsonData = JSON.parse(data);
                    if (!jsonData) {
                        return reject(new Error("Empty JSON file"));
                    }
                    resolve(jsonData);
                } catch (e) {
                    reject(new Error("Invalid JSON format"));
                }
            });
        }
        else if (extname === ".csv") {
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (data) => {
                    const cleaned = {};
                    Object.keys(data).forEach(key => {
                        if (key && data[key] != null) {
                            cleaned[key.trim()] = data[key].toString().trim();
                        }
                    });
                    results.push(cleaned);
                })
                .on("end", () => {
                    if (results.length === 0) return reject(new Error("Empty CSV file"));
                    resolve(results);
                })
                .on("error", (err) => reject(new Error(`Error parsing CSV: ${err.message}`)));
        }
        else {
            reject(new Error("Unsupported file type"));
        }
    });
};
