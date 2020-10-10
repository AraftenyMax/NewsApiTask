import { OAuth2Credentials, OAuth2Profile } from './oauth2.credentials';
import { google } from "googleapis";
import {OAuth2ClientOptions, OAuth2Client} from 'google-auth-library';
import { GOOGLE } from '../../config';

const configuration: OAuth2ClientOptions = {
    clientId: GOOGLE.CLIENT_ID,
    clientSecret: GOOGLE.CLIENT_SECRET,
    redirectUri: GOOGLE.REDIRECT_URI
}
const oauth2Client = new OAuth2Client(configuration);

export const loginLink = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
});


export default class OAuth2Service {
    async authenticateUser(creds: OAuth2Credentials): Promise<OAuth2Profile> {
        const client = await oauth2Client.getToken(creds.code);
        oauth2Client.setCredentials(client.tokens);
        const oauth2 = google.oauth2({auth: oauth2Client, version: 'v2'});
        const userInfo = await oauth2.userinfo.get();
        const profile: OAuth2Profile = {
            email: userInfo.data.email!,
            firstName: userInfo.data.given_name!,
            lastName: userInfo.data.family_name!,
        }
        return profile;
    }
}