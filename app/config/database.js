const mongoUser = process.env.MONGO_USER
const mongoPassword = process.env.MONGO_PASSWORD

module.exports = {
  databaseUri: `mongodb://${mongoUser}:${mongoPassword}@ds219641.mlab.com:19641/bologna-js`,
  databaseName: 'bologna-js'
}
