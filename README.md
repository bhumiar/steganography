# steganography
# 🔐 Multi-Image Steganography System

A browser-based tool to **securely hide** and **extract** secret messages across multiple images using the **Least Significant Bit (LSB)** technique plus simple password-based encryption. Designed as a mini-project to demonstrate client-side data embedding, encryption, and ZIP packaging for download.

---

## 🚀 Features

- **Multi-Image Embedding**  
  Split your secret text into equal chunks and embed each chunk into a different image.  
- **LSB Steganography**  
  Uses the least significant bit of each RGB channel to hide data without noticeably altering the image.  
- **Password-Protected Encryption**  
  Simple character-shift encryption tied to your password ensures that even if bits are extracted, they remain scrambled.  
- **Batch Download**  
  Packages all embedded PNGs into a single ZIP file for easy download (via JSZip).  
- **Web-Only**  
  Fully client-side: no server required. Works in any modern browser.

---

## 🛠️ Tech Stack

| Component             | Library / API         | Purpose                                 |
|-----------------------|-----------------------|-----------------------------------------|
| HTML5                 | —                     | Page structure (`login.html`, `embed.html`, `extract.html`) |
| CSS                   | —                     | Basic styling                           |
| JavaScript (ES6)      | —                     | Embedding & extraction logic            |


---

## 📷 pages

- **Login Page**  
- **Embed Interface**  
- **Extraction Interface**  

---

## 🚀 How to Use

### 🔐 Login
1. Open `login.html` in your browser.
2. Login with these credentials:
   - **Username:** `user`
   - **Password:** `pass`

### 🖼️ Embed Secret Message
1. After login, you'll be redirected to the embed page.
2. Select **three images** (`.png` or `.jpg`).
3. Enter:
   - The **text** you want to hide.
   - An **embedding password**.
4. Click **Embed**.
5. A **ZIP file** containing the stego-images will be downloaded.

### 🔍 Extract Secret Message
1. Open `extract.html` in your browser.
2. Select the **ZIP file** you downloaded earlier.
3. Enter the **same password** used for embedding.
4. Click **Extract** to reveal your hidden message.

---

🔍 How It Works (Code Overview)

Splitting & Encryption
js code
const chunks = chunkString(data, Math.ceil(data.length / files.length));
const encryptedChunks = chunks.map(chunk => encrypt(chunk, password));


LSB Embedding
js code
for (let i = 0; i < imageData.data.length; i += 4) {
  for (let j = 0; j < 3; j++) {
    if (dataIndex < binaryData.length) {
      imageData.data[i + j] = (imageData.data[i + j] & ~1) | parseInt(binaryData[dataIndex]);
      dataIndex++;
    }
  }
}


ZIP Packaging (using JSZip)
js code
const zip = new JSZip();
embeddedBlobs.forEach((blob, i) => zip.file(`embedded_image_${i+1}.png`, blob));
zip.generateAsync({ type: 'blob' }).then(blob => {/* trigger download */});
Extraction & Decryption

Read all image bits → reconstruct binary → convert to text
Apply reverse encrypt() logic → recover original message

---

🙋‍♂️ Author
Developed by Bhumi Arya
🔗 https://github.com/bhumiar

---
