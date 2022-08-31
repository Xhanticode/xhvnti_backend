const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client("127238917335-sjj2jvvti2v9ch565nkkl42nhmujs5sl.apps.googleusercontent.com")

// Call this function to validate the JWT credential sent from client-side
async function verifyCredentials(credential) {
  const ticket = await client.verifyIdToken({
    idToken: credential,
  })
  const payload = ticket.getPayload()
  return payload
}

verifyCredentials('JWT_CREDENTIAL_STRING_FROM_CLIENT_SIDE').then((userInfo) => {
  // use userInfo and do your server-side logics here
  console.log(userInfo)
}).catch((error) => {
  // validation failed and userinfo was not obtained
})

