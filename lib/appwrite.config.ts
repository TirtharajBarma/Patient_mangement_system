import * as sdk from 'node-appwrite';
export const {
    PROJECT_ID, 
    API_KEY, 
    DATABASE_ID, 
    PATIENT_COLLECTION_ID, 
    DOCTOR_COLLECTION_ID, 
    APPOINTMENT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID, 
    NEXT_PUBLIC_ENDPOINT: ENDPOINT 
} = process.env

const client = new sdk.Client();

if (!PROJECT_ID) {
  throw new Error('PROJECT_ID is not defined in environment variables');
}

if (!API_KEY) {
  throw new Error('API_KEY is not defined in environment variables');
}

if (!ENDPOINT) {
  throw new Error('ENDPOINT is not defined in environment variables');
}

// console.log("PROJECT_ID:", process.env.PROJECT_ID);


client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);