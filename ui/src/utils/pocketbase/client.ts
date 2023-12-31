import PocketBase, { RecordModel } from 'pocketbase';

// Set a default value for the PocketBase URL for safety
const DEFAULT_POCKETBASE_URL = 'http://localhost:7676';

// Define the base URL for the PocketBase instance
const pocketBaseUrl =
  process.env.NEXT_PUBLIC_POCKETBASE_URL || DEFAULT_POCKETBASE_URL;

// Initialize the PocketBase client
const client = new PocketBase(pocketBaseUrl);

// Ensure this code runs only on the client
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Initialization that requires the window or document goes here

  // Load existing authStore from cookie
  client.authStore.loadFromCookie(document.cookie);

  // Subscribe to authStore changes and update cookie accordingly
  client.authStore.onChange(() => {
    document.cookie = client.authStore.exportToCookie({ httpOnly: false });
  });
}

export const getRecordFileUrl = (
  pocketbase: PocketBase,
  fileFieldName: string
) => (record: RecordModel) =>
  pocketbase.files.getUrl(record, record[fileFieldName]);

export const getAssetFileUrl = (pocketbase: PocketBase) =>
  getRecordFileUrl(client, 'file');
export const getAvatarUrl = getRecordFileUrl(client, 'avatar');

export default client;
