/*async function extractData(images, password) {
    document.getElementById('error-message').innerText = "";
    const extractedChunks = [];

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        console.log("Processing image:", i);
        const extracted = await extract(canvas);
        console.log("Extracted data for image", i, ":", extracted);
        extractedChunks.push(extracted);
    }

    extractedChunks.sort((a, b) => a.index - b.index);
    const encryptedString = extractedChunks.map(chunk => chunk.data).join('');
    console.log("Combined Extrypted String:", encryptedString);

    // Directly display the combined (potentially encrypted) string
    document.getElementById('result').innerText = encryptedString;

    // Remove or comment out the decryption part for now
    
    try{
        const extractedString = decrypt(encryptedString, password);
        document.getElementById('result').innerText = extractedString;
        console.log("Final Decrypted String:", extractedString);
    } catch(e){
        document.getElementById('error-message').innerText = "Incorrect Password or Data Corrupted";
        console.error("Decryption Error:", e);
    }
    
}*/

/*document.getElementById('extract').addEventListener('click', async () => {
    const zipFile = document.getElementById('extractZip').files[0];
    const password = document.getElementById('extractPassword').value;

    if (!zipFile) {
        document.getElementById('error-message').innerText = "Please select a zip file.";
        return;
    }
    if(!password){
        document.getElementById('error-message').innerText = "Please enter extraction password";
        return;
    }

    try {
        const zip = await JSZip.loadAsync(zipFile);
        const imageBlobs = [];
        zip.forEach((relativePath, zipEntry) => {
            if (!zipEntry.dir && relativePath.toLowerCase().endsWith('.png')) {
                imageBlobs.push(zipEntry.async('blob'));
            }
        });

        const images = await Promise.all(imageBlobs);
        const extractedData = await extractData(images, password);
        document.getElementById('result').innerText = extractedData;

    } catch (error) {
        document.getElementById('error-message').innerText = "Error processing zip file or images.";
    }
});

async function extractData(images, password) {
    document.getElementById('error-message').innerText = "";
    const extractedChunks = [];

    for (const imageBlob of images) {
        const img = await createImageBitmap(imageBlob);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const extracted = await extract(canvas);
        extractedChunks.push(extracted);
    }
    extractedChunks.sort((a, b) => a.index - b.index);
    const encryptedString = extractedChunks.map(chunk => chunk.data).join('');
    console.log("Encrypted String Before Decrypt:",encryptedString);
    try{
        const extractedString = decrypt(encryptedString, password);
        console.log("Decrypted String:",extractedString);
        return extractedString;
    } catch(e){
        document.getElementById('error-message').innerText = "Incorrect Password or Data Corrupted";
        return "";
    }
}

async function extract(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log("ImageData:",imageData);
    let binaryData = '';

    for (let i = 0; i < imageData.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            binaryData += (imageData.data[i + j] & 1).toString();
        }
    }

    const index = parseInt(binaryData.slice(0, 16), 2);
    const total = parseInt(binaryData.slice(16, 32), 2);
    console.log("Extracted Index(Decimal):",index,"Extracted Total(Decimal):",total);
    const data = binaryToString(binaryData.slice(32));
    console.log("Binary Data:",binaryData);
    console.log("Index:",index);
    console.log("Total:",total);
    console.assertlog("Extracted data before binary to string:",data);

    return { index, total, data };
}

function binaryToString(binary) {
    let str = '';
    for (let i = 0; i < binary.length; i += 8) {
        console.log("Binary Chunk:",binary.substring(i,i+8));
        console.log("Character Code:",parseInt(binary.substring(i,i+8),2));
        str += String.fromCharCode(parseInt(binary.substring(i, i + 8), 2));
    }
    return str;
}

function decrypt(encrypted, password) {
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
        console.log("Encrypted Char:",encrypted.charCodeAt(i));
        console.log("Password Char:",password.charCodeAt(i%password.length));
        decrypted += String.fromCharCode(encrypted.charCodeAt(i) - password.charCodeAt(i % password.length));
    }
    console.log("Decrypted String:",decrypted);
    return decrypted;
}

*/


/*
document.getElementById('extract').addEventListener('click', async () => {
    const zipFile = document.getElementById('extractZip').files[0];
    const password = document.getElementById('extractPassword').value;

    if (!zipFile) {
        document.getElementById('error-message').innerText = "Please select a zip file.";
        return;
    }
    if (!password) {
        document.getElementById('error-message').innerText = "Please enter extraction password";
        return;
    }

    try {
        const zip = await JSZip.loadAsync(zipFile);
        const imageDatas = [];
        for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
            if (!zipEntry.dir && relativePath.toLowerCase().endsWith('.png')) {
                const blob = await zipEntry.async('blob');
                const img = await createImageBitmap(blob);
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                imageDatas.push(imageData);
            }
        }

        const extractedData = await extractData(imageDatas, password);
        document.getElementById('result').innerText = extractedData;

    } catch (error) {
        document.getElementById('error-message').innerText = "Error processing zip file or images.";
        console.error("Extraction Error:", error);
    }
});

async function extractData(imageDatas, password) {
    document.getElementById('error-message').innerText = "";
    const extractedChunks = [];

    for (const imageData of imageDatas) {
        const extracted = extract(imageData);
        if (extracted) {
            extractedChunks.push(extracted);
        }
    }

    extractedChunks.sort((a, b) => a.index - b.index);
    const encryptedString = extractedChunks.map(chunk => chunk.data).join('');
    console.log("Encrypted String Before Decrypt:", encryptedString);
    try {
        const extractedString = decrypt(encryptedString, password);
        console.log("Decrypted String:", extractedString);
        return extractedString;
    } catch (e) {
        document.getElementById('error-message').innerText = "Incorrect Password or Data Corrupted";
        console.error("Decryption Error:", e);
        return "";
    }
}

function extract(imageData) {
    console.log("ImageData:", imageData);
    let binaryData = '';

    for (let i = 0; i < imageData.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            binaryData += (imageData.data[i + j] & 1).toString();
        }
    }

    // Ensure enough bits for index and total
    if (binaryData.length < 32) {
        console.warn("Not enough data in image for index and total.");
        return null;
    }

    const index = parseInt(binaryData.slice(0, 16), 2);
    const total = parseInt(binaryData.slice(16, 32), 2);
    console.log("Extracted Index(Decimal):", index, "Extracted Total(Decimal):", total);

    // Ensure enough bits for data
    if (binaryData.length < 32 + (total * 8)) {
        console.warn("Not enough data in image for the expected data length.");
        return null;
    }

    const dataBinary = binaryData.slice(32, 32 + (total * 8));
    const data = binaryToString(dataBinary);
    console.log("Binary Data:", binaryData);
    console.log("Index:", index);
    console.log("Total:", total);
    console.log("Extracted data before binary to string:", data);

    return { index, total, data };
}

function binaryToString(binary) {
    let str = '';
    for (let i = 0; i < binary.length; i += 8) {
        const chunk = binary.substring(i, i + 8);
        if (chunk.length === 8) {
            const charCode = parseInt(chunk, 2);
            console.log("Binary Chunk:", chunk);
            console.log("Character Code:", charCode);
            str += String.fromCharCode(charCode);
        }
    }
    return str;
}

function decrypt(encrypted, password) {
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
        const encryptedCharCode = encrypted.charCodeAt(i);
        const passwordCharCode = password.charCodeAt(i % password.length);
        console.log("Encrypted Char:", encryptedCharCode);
        console.log("Password Char:", passwordCharCode);
        decrypted += String.fromCharCode(encryptedCharCode - passwordCharCode);
    }
    console.log("Decrypted String:", decrypted);
    return decrypted;
}*/


document.getElementById('extract').addEventListener('click', async () => {
    const zipFile = document.getElementById('extractZip').files[0];
    const password = document.getElementById('extractPassword').value;

    if (!zipFile) {
        document.getElementById('error-message').innerText = "Please select a zip file.";
        return;
    }
    if (!password) {
        document.getElementById('error-message').innerText = "Please enter extraction password";
        return;
    }

    // try {
    //     const zip = await JSZip.loadAsync(zipFile);
    //     const imageDatas = [];
    //     for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
    //         if (!zipEntry.dir && relativePath.toLowerCase().endsWith('.png')) {
    //             const blob = await zipEntry.async('blob');
    //             const img = await createImageBitmap(blob);
    //             const canvas = document.createElement('canvas');
    //             canvas.width = img.width;
    //             canvas.height = img.height;
    //             const ctx = canvas.getContext('2d');
    //             ctx.drawImage(img, 0, 0);
    //             const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //             imageDatas.push(imageData);
    //         }
    //     }

    //     const extractedData = await extractData(imageDatas, password);
    //     document.getElementById('result').innerText = extractedData;

    // } catch (error) {
    //     document.getElementById('error-message').innerText = "Error processing zip file or images.";
    //     console.error("Extraction Error:", error);
    // }
});

async function extractData(imageDatas, password) {
    document.getElementById('error-message').innerText = "";
    const extractedChunks = [];

    for (const imageData of imageDatas) {
        const extracted = extract(imageData);
        if (extracted) {
            extractedChunks.push(extracted);
        }
    }

    extractedChunks.sort((a, b) => a.index - b.index);
    const encryptedString = extractedChunks.map(chunk => chunk.data).join('');
    console.log("Encrypted String Before Decrypt:", encryptedString);
    try {
        const extractedString = decrypt(encryptedString, password);
        console.log("Decrypted String:", extractedString);
        return extractedString;
    } catch (e) {
        document.getElementById('error-message').innerText = "Incorrect Password or Data Corrupted";
        console.error("Decryption Error:", e);
        return "";
    }
}

/*
function extract(imageData) {
    console.log("ImageData:", imageData);
    let binaryData = '';

    for (let i = 0; i < imageData.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            binaryData += (imageData.data[i + j] & 1).toString();
        }
    }

    // Ensure enough bits for index and total
    if (binaryData.length < 32) {
        console.warn("Not enough data in image for index and total.");
        return null;
    }

    const index = parseInt(binaryData.slice(0, 16), 2);
    const total = parseInt(binaryData.slice(16, 32), 2);
    console.log("Extracted Index(Decimal):", index, "Extracted Total(Decimal):", total);

    // Ensure enough bits for data
    if (binaryData.length < 32 + (total * 8)) {
        console.warn("Not enough data in image for the expected data length.");
        return null;
    }

    const dataBinary = binaryData.slice(32, 32 + (total * 8));
    const data = binaryToString(dataBinary);
    console.log("Binary Data:", binaryData);
    console.log("Index:", index);
    console.log("Total:", total);
    console.log("Extracted data before binary to string:", data);

    return { index, total, data };
}

function binaryToString(binary) {
    let str = '';
    for (let i = 0; i < binary.length; i += 8) {
        const chunk = binary.substring(i, i + 8);
        if (chunk.length === 8) {
            const charCode = parseInt(chunk, 2);
            console.log("Binary Chunk:", chunk);
            console.log("Character Code:", charCode);
            str += String.fromCharCode(charCode);
        }
    }
    return str;
}

function decrypt(encrypted, password) {
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
        const encryptedCharCode = encrypted.charCodeAt(i);
        const passwordCharCode = password.charCodeAt(i % password.length);
        console.log("Encrypted Char:", encryptedCharCode);
        console.log("Password Char:", passwordCharCode);
        decrypted += String.fromCharCode(encryptedCharCode - passwordCharCode);
    }
    console.log("Decrypted String:", decrypted);
    return decrypted;
}*/

// Get the data from localStorage
// const retrievedData = localStorage.getItem("hiddenData");

// if (retrievedData) {
//     console.log("Retrieved hidden data:", retrievedData);
//     // Now you can use it
// } else {
//     console.log("No hidden data found.");
// }
function extractText(){
    // const textarea = document.getElementById(retrievedData);
    // const inputText = textarea.Value;
    alert ("this is hidden data");
}