import express,{Request,Response,NextFunction} from 'express';
import { AddFood, GetFood, GetVandorProfile, UpdateVandorCoverImage, UpdateVandorProfile, UpdateVandorService, VandorLogin } from '../controllers';
import { Authenticate } from '../middlewares/';
import multer from 'multer';
const router = express.Router();

const imageStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    }, filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g, '_')+file.originalname );
    }
// new Date().toISOString()

});
const images = multer({storage: imageStorage}).array('images',10)

router.post('/login',VandorLogin);
router.use(Authenticate)
router.get('/profile',GetVandorProfile);
router.patch('/profile',UpdateVandorProfile);
router.patch('/service',UpdateVandorService);
router.patch('/coverimage',images,UpdateVandorCoverImage);

router.post('/food',images,AddFood);
router.get('/foods',GetFood);

router.get('/',(req:Request, res:Response, next:NextFunction)=>{
    res.json({message: 'Hello from vandor'})
});

export {router as VandorRouter}