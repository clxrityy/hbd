import fs from "fs";
import path from "path";

/* 
    this function will accept 2 (one is optional) parameters:
    (1) the directory of which to read the files
    (2) if the function should read folders only, which we'll set as false by default
*/

const getFiles = (directory: string, foldersOnly = false) => {
    let fileNames = [];

    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(directory, file.name);

        if (foldersOnly) {
            if (file.isDirectory()) {
                fileNames.push(filePath);
            }
        } else {
            if (file.isFile()) {
                fileNames.push(filePath);
            }
        }
    }

    return fileNames;
}

export default getFiles;