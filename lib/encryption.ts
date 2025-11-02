// End-to-End Encryption using Web Crypto API
// AES-GCM encryption for secure group messaging

export interface EncryptedMessage {
  encrypted: string // Base64 encoded encrypted content
  iv: string // Base64 encoded initialization vector
}

/**
 * Generate a new AES-GCM encryption key for a group
 */
export async function generateGroupKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true, // extractable
    ["encrypt", "decrypt"]
  )
}

/**
 * Export a CryptoKey to a base64 string for storage
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("raw", key)
  return btoa(String.fromCharCode(...new Uint8Array(exported)))
}

/**
 * Import a base64 string back to a CryptoKey
 */
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyData = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0))
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  )
}

/**
 * Encrypt a message using AES-GCM
 */
export async function encryptMessage(message: string, key: CryptoKey): Promise<EncryptedMessage> {
  // Generate a random initialization vector
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Encode the message
  const encoder = new TextEncoder()
  const data = encoder.encode(message)

  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  )

  // Convert to base64 for storage
  return {
    encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  }
}

/**
 * Decrypt a message using AES-GCM
 */
export async function decryptMessage(encrypted: string, iv: string, key: CryptoKey): Promise<string> {
  try {
    // Convert from base64
    const encryptedData = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))
    const ivData = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0))

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: ivData,
      },
      key,
      encryptedData
    )

    // Decode
    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch (error) {
    console.error("Decryption failed:", error)
    return "[Unable to decrypt message]"
  }
}

/**
 * Store group encryption key in localStorage
 * Note: In production, consider more secure storage methods
 */
export function storeGroupKey(groupId: string, keyString: string): void {
  localStorage.setItem(`group_key_${groupId}`, keyString)
}

/**
 * Retrieve group encryption key from localStorage
 */
export function getGroupKey(groupId: string): string | null {
  return localStorage.getItem(`group_key_${groupId}`)
}

/**
 * Initialize encryption for a new group
 * Returns the encryption key ID to store in the database
 */
export async function initializeGroupEncryption(groupId: string): Promise<string> {
  // Generate new key
  const key = await generateGroupKey()

  // Export and store
  const keyString = await exportKey(key)
  storeGroupKey(groupId, keyString)

  // Return a key ID (could be a hash or UUID)
  // For now, we'll use a simple prefix
  return `key_${groupId}_${Date.now()}`
}

/**
 * Get or create encryption key for a group
 */
export async function getOrCreateGroupKey(groupId: string): Promise<CryptoKey> {
  // Try to get existing key
  let keyString = getGroupKey(groupId)

  // If no key exists, create one
  if (!keyString) {
    const newKey = await generateGroupKey()
    keyString = await exportKey(newKey)
    storeGroupKey(groupId, keyString)
    return newKey
  }

  // Import existing key
  return await importKey(keyString)
}

/**
 * Encrypt and prepare message for database storage
 */
export async function prepareEncryptedMessage(
  message: string,
  groupId: string
): Promise<{ encrypted_content: string; encryption_iv: string }> {
  const key = await getOrCreateGroupKey(groupId)
  const encrypted = await encryptMessage(message, key)

  return {
    encrypted_content: encrypted.encrypted,
    encryption_iv: encrypted.iv,
  }
}

/**
 * Decrypt message from database
 */
export async function decryptStoredMessage(
  encryptedContent: string,
  encryptionIv: string,
  groupId: string
): Promise<string> {
  try {
    const key = await getOrCreateGroupKey(groupId)
    return await decryptMessage(encryptedContent, encryptionIv, key)
  } catch (error) {
    console.error("Failed to decrypt message:", error)
    return "[Message could not be decrypted]"
  }
}

