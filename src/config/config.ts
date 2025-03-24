export default() => ({
    security: {
        encryptionSecretKey: process.env.ENCRYPTION_KEY,
    },
});