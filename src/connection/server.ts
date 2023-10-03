import express from 'express';
 
// Initialize the express engine
const app: express.Application = express();
 
// Take port 8000 for running the server.
const port: number = 8000;
 
// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send("Your TypeScript With Express");
});
 
// Server setup

export const serverUp = async () => {
 await app.listen(port, () => {
    console.log(`bot is running at http://localhost:${port}/`);
});
  
}
