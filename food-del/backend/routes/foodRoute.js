import express from 'express';
import multer from 'multer';
import path from 'path';
import { listFood, addFood, removeFood } from '../controllers/foodController.js';

const foodRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

foodRouter.get("/", listFood);
foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.delete("/remove", removeFood);

export default foodRouter;
