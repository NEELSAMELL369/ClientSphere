import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: "postgresql://postgres:99gfhwpKg5LD5UbK@db.lkqrpwppvnclqkbpozve.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

async function testDB() {
  try {
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query("SELECT NOW();");
    console.log(res.rows);
    await client.end();
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

testDB();
