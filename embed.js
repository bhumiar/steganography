document.getElementById('embed').addEventListener('click', async () => {
    const files = [
        document.getElementById('image1').files[0],
        document.getElementById('image2').files[0],
        document.getElementById('image3').files[0]
    ];
    const data = document.getElementById('data').value;
    const password = document.getElementById('embedPassword').value;

    if (!files[0] || !files[1] || !files[2]) {
        document.getElementById('error-message').innerText = "Please select three image files.";
        return;
    }

    if (!data) {
        document.getElementById('error-message').innerText = "Please enter data to hide.";
        return;
    }
    if (!password){
        document.getElementById('error-message').innerText = "Please Enter embedding password";
        return;
    }

    await multiImageSteganography(files, data, password);
});

async function multiImageSteganography(files, data, password) {
    document.getElementById('error-message').innerText = "";
    const outputImagesDiv = document.getElementById('output-images');
    outputImagesDiv.innerHTML = '';
    const chunks = chunkString(data, Math.ceil(data.length / files.length));
    const embeddedImages = [];
    const encryptedChunks = chunks.map(chunk => encrypt(chunk, password));

    for (let i = 0; i < files.length; i++) {
        const img = await createImageBitmap(files[i]);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const embeddedCanvas = await embedData(canvas, encryptedChunks[i], i, encryptedChunks.length);
        const embeddedBlob = await new Promise(resolve => embeddedCanvas.toBlob(resolve, 'image/png'));
        const embeddedUrl = URL.createObjectURL(embeddedBlob);
        embeddedImages.push(embeddedBlob);

        const imgElement = document.createElement('img');
        imgElement.src = embeddedUrl;
        outputImagesDiv.appendChild(imgElement);
    }
    window.embeddedBlobs = embeddedImages;
    document.getElementById('downloadZip').style.display = 'block';
}

async function embedData(canvas, data, index, total) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const binaryData = stringToBinary(index.toString(2).padStart(16, '0') + total.toString(2).padStart(16, '0') + data);
    console.log("Embedding-Full Binary Data(first 24 bits):",binaryData.slice(0,64));
    let dataIndex = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            if (dataIndex < binaryData.length) {
                imageData.data[i + j] = (imageData.data[i + j] & ~1) | parseInt(binaryData[dataIndex]);
                dataIndex++;
            } else {
                ctx.putImageData(imageData, 0, 0);
                return canvas;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

function stringToBinary(str) {
    let binary = '';
    for (let i = 0; i < str.length; i++) {
        binary += str[i].charCodeAt(0).toString(2).padStart(8, '0');
    }
    return binary;
}

function binaryToString(binary) {
    let str = '';
    for (let i = 0; i < binary.length; i += 8) {
        str += String.fromCharCode(parseInt(binary.substring(i, i + 8), 2));
    }
    return str;
}

function chunkString(str, length) {
    const chunks = [];
    for (let i = 0; i < str.length; i += length) {
        chunks.push(str.substring(i, i + length));
    }
    return chunks;
}

function encrypt(text, password) {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(text.charCodeAt(i) + password.charCodeAt(i % password.length));
    }
    return encrypted;
}


document.getElementById('downloadZip').addEventListener('click', async () => {
    const embeddedBlobs = window.embeddedBlobs;
    if (embeddedBlobs && embeddedBlobs.length > 0) {
        const zip = new JSZip();
        embeddedBlobs.forEach((blob, index) => {
            zip.file(`embedded_image_${index + 1}.png`, blob);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(zipBlob);
        downloadLink.download = 'embedded_images.zip';
        downloadLink.click();
    }
});
