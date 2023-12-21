import cors from 'cors';

const corsOptions = {
  origin: ['https://todolist-5j0i.onrender.com'],
  optionsSuccessStatus: 200,
  credentials: true,

};
const corsMiddleware = cors(corsOptions);

export default corsMiddleware;