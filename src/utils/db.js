const { username, password } = process.env;

export const connectionString = `mongodb+srv://${username}:${password}@cluster0.0eapj.mongodb.net/webmentorDB?retryWrites=true&w=majority&appName=Cluster0`;
