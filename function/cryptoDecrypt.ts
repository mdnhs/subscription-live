import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export const encrypt = (text: string, encryptionKey: string) => {
  try {
    // Ensure key is 16 bytes (128 bits) for AES-128
    const key = Buffer.alloc(16);
    Buffer.from(encryptionKey).copy(key, 0, 0, 16);
    
    // Generate random IV
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-128-cbc', key, iv);
    
    let encryptedText = cipher.update(text, 'utf8', 'hex');
    encryptedText += cipher.final('hex');
    
    // Return IV concatenated with encrypted text (needed for decryption)
    return iv.toString('hex') + ':' + encryptedText;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

// Decrypt function that handles the IV
export const decrypt = (text: string, encryptionKey: string) => {
  try {
    // Split the IV and encrypted text
    const [ivHex, encryptedText] = text.split(':');
    if (!ivHex || !encryptedText) {
      throw new Error('Invalid encrypted text format');
    }

    // Ensure key is 16 bytes (128 bits) for AES-128
    const key = Buffer.alloc(16);
    Buffer.from(encryptionKey).copy(key, 0, 0, 16);
    
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv('aes-128-cbc', key, iv);
    
    let decryptedText = decipher.update(encryptedText, 'hex', 'utf-8');
    decryptedText += decipher.final('utf-8');
    
    return decryptedText;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};


export const infoFromDecryptData = (input: string) => {
  try {
    const keyValuePairs = input.split("&");
    const result: { [key: string]: string } = {};

    for (const pair of keyValuePairs) {
      const [key, value] = pair.split("=");
      result[key] = value;
    }
    return result;
  } catch (error) {
    return "";
  }
};

export function extractCallbackUrlFromString(inputString: string) {
  const callbackUrlPattern = /callBackUrl=([^&]+)/;
  const match = inputString.match(callbackUrlPattern);

  if (match) {
    return match[1];
  } else {
    return null;
  }
}

export const stringToBoolean = (input: string) => {
  switch (input?.toLowerCase()?.trim()) {
    case "True":
    case "true":
    case "yes":
    case "1":
      return true;

    case "False":
    case "false":
    case "no":
    case "0":
    case null:
    case undefined:
      return false;

    default:
      return false;
  }
};

export const encryptBase64 = (input: Object) => {
  try {
    const jsonString = JSON.stringify(input);
    const buffer = Buffer.from(jsonString);
    return buffer.toString("base64");
  } catch (error) {
    return "";
  }
};

export const decryptBase64 = (input: any) => {
  try {
    const buffer = Buffer.from(input, "base64");
    return JSON.parse(buffer.toString("utf-8"));
  } catch (error) {
    return "";
  }
};
