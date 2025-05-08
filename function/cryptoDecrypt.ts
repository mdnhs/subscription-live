import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export const encrypt = (text: string, encryptionKey: string) => {
  try {
    // Ensure key is 16 bytes (128 bits) for AES-128
    const key = Buffer.alloc(16);
    Buffer.from(encryptionKey).copy(key, 0, 0, 16);

    // Generate random IV
    const iv = randomBytes(16);
    const cipher = createCipheriv("aes-128-cbc", key, iv);

    let encryptedText = cipher.update(text, "utf8", "hex");
    encryptedText += cipher.final("hex");

    // Return IV concatenated with encrypted text (needed for decryption)
    return iv.toString("hex") + ":" + encryptedText;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Encryption failed: ${error.message}`);
    } else {
      throw new Error("Encryption failed: Unknown error");
    }
  }
};

// Decrypt function that handles the IV
export const decrypt = (text: string, encryptionKey: string) => {
  try {
    // Split the IV and encrypted text
    const [ivHex, encryptedText] = text?.split(":");
    if (!ivHex || !encryptedText) {
      throw new Error("Invalid encrypted text format");
    }

    // Ensure key is 16 bytes (128 bits) for AES-128
    const key = Buffer.alloc(16);
    Buffer.from(encryptionKey).copy(key, 0, 0, 16);

    const iv = Buffer.from(ivHex, "hex");
    const decipher = createDecipheriv("aes-128-cbc", key, iv);

    let decryptedText = decipher.update(encryptedText, "hex", "utf-8");
    decryptedText += decipher.final("utf-8");

    return decryptedText;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Decryption failed: ${error.message}`);
    } else {
      throw new Error('Decryption failed: Unknown error');
    }
  }
};
