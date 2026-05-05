import admin from "firebase-admin";
import * as fireorm from "fireorm";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "street-race-x-api",
    clientEmail:
      "firebase-adminsdk-fbsvc@street-race-x-api.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDHviglOrp/cB2A\nG2OTUsoykZSrG+ugQsNYNi6niH76Jc1VhmgO9nNUgOj4L9ltEWYaWK/rh7FTdkUr\n39XHKoQt42B6BnbIt5IE3w2if6xg4YIh+1leHT8rSPKyYN/FEoQwzotk05XA2wId\nKXrlqELzgLee1NoGgBM9mm7US8pf6wRY39N/9q96aeDkQr2HqMhYz2ZYpiCM7Bf1\nlf12mwIjVDofcVVkfR5j084PbJ+9mDAbX2uY4oQixMU9euwBYtOvW4y1K+pAsFYN\nCfmO/cwPWsh3HiOFrf9mE10m4+/PEMbfAjQtcnnlj0ol28Y2wROcyxnJUTsmbkJr\nMpQVvw/LAgMBAAECggEAFBuXBARxAOJC/gID2LFlbIjOTBlv8361FpzBvpjVm44R\nqTHyKMtzmcaubUm33Cx7uFxEPXQ4DDxkQ0Hxze6ARvRUYoRjEdq1BuuDfl/W9RvO\nk2gvu3M7SDq8P+vTqw2tpBIu4zQPp84EXPYvio4RS10iXwlzd2MOTM3OqW2Fznj3\nN1HU1E1cPi8q+bRsH0KmfCbnpiL0WkOAU0OLQ4yeD1ZAAAjOJ2yIPN9/OBYFQGUN\nOy3UhF74+DKVe01uGAgbnwQGq1fL3EoOQv1UzoZy+r0sEDDKM6lxdHUZoqt4XIF2\nOf909A+U9sbdCmbUTp2lpjlUlaTa/g+BtNC9CBVS/QKBgQDoyThX1LVNWBHsRbI1\nEjO3qvfxT4YLCeDL+EOngHNwo32yki/7U02xNLZc1b9D2jFy4AUsH33+gtl+f2y7\nRJ273AQveaOM35vTdRyAhibvayORqt/eslutEQTVWXeWFrS+WE+ReLXEiAIsvNuB\nEAwTyOcrK4SSfr0b+Sf7sxvtPQKBgQDbqWDlOefdMd45xUE1OF8X523OM83cnmzN\n4+k38bJmVVFYkfozMoxaNphErT3J1rN8XUhzCPZtBGpn8UJEeFB3S2QGq0kR4q8Y\n/ZE/OWkC+Jr7r/sz6NAEnVMNXq01MD82oAxUYd90iCTNHgoeLReCP4eM84k76gFx\nFtGUr8NRpwKBgGDKmiTbCu+3+OvXJvwuL1blPecWe9PHLbNh7S+Ol3F0aWWAp3bG\n8n0GP/Vl4vthlEIBp+Tqy0ayPaD9dsZ/B17/YrYiy8Bdkbtg7JL8NOBEGiwNcrx0\nSO4zL2FOrAy6MDkdGyiPmnS3YMAdXt/RPlRTqtsmYx9Ol280ME3V8Xy5AoGALUgf\nZ2GmgJy1GOem55e1UrIsmqNnPqGSAGeJPjUe96WC3WVKVJ+I+1fhz9Z+tEsEORDp\nzHz+f763SLIdXQwIWm86MX3B1GQMgHRVKtlk4m3pVRUUDcFikHD2G/12a06E2Xfo\n0sRSUi12mKomn83f2MPL56yUj7tPjMaNcb9B3mUCgYB+goACA0m72fBuyweimY10\nMszkJql71WkCLayIm9pSX551zYTiDp462NiFSpE862DIkQxYFmOskrzOBA8XfFmr\n+fFVu8Bh/bayyST/nGy78Jhne48xDQeOoWHXErl8hs7HDcMA2VfP4HYcwiEx21DR\nmYkOlEUrwEX3TNf7KyzPwg==\n-----END PRIVATE KEY-----\n",
  }),
  databaseURL: `https://street-race-x.firebaseio.com`,
});

const firestore = admin.firestore();
fireorm.initialize(firestore);
