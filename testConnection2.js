const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://testuser:simplepass@prizeplatform.pkqdrcp.mongodb.net/?retryWrites=true&w=majority&appName=PrizePlatform";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.log("❌ Connection failed:", error.message);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
