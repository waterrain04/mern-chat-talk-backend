import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
accessChat,
getAllChat,
createGroupChat,
renameGroup,
addToGroup,
removeFromGroup
} from '../controllers/chatController.js'

const router = express.Router();


router.post('/',protect,accessChat);
router.get('/',protect, getAllChat);
router.post('/group',protect,createGroupChat);
router.put('/rename',protect,renameGroup)
router.put('/groupRemove',protect,removeFromGroup)
router.put('/groupAdd',protect,addToGroup);


export default router;