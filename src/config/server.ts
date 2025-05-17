import express from 'express';

const server = express();

server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true, limit: '50mb' }));

export default server;
